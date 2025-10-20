/**
 * Rate limiting middleware
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimitError } from '../errors/app-error';

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
  keyGenerator?: (request: FastifyRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Rate limiting middleware
 * 
 * @example
 * ```typescript
 * // Global rate limit
 * fastify.addHook('preHandler', rateLimit({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 100 // 100 requests per 15 minutes
 * }));
 * 
 * // Per-route rate limit
 * fastify.post('/api/auth/login', {
 *   preHandler: rateLimit({
 *     windowMs: 15 * 60 * 1000,
 *     max: 5, // 5 login attempts per 15 minutes
 *     keyGenerator: (req) => req.ip + ':login'
 *   })
 * }, loginHandler);
 * 
 * // Per-user rate limit
 * fastify.post('/api/courses', {
 *   preHandler: [
 *     authenticate,
 *     rateLimit({
 *       windowMs: 60 * 60 * 1000,
 *       max: 10,
 *       keyGenerator: (req) => req.user!.userId
 *     })
 *   ]
 * }, createCourseHandler);
 * ```
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    max,
    keyGenerator = (request: FastifyRequest) => request.ip || 'unknown',
  } = config;

  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const key = keyGenerator(request);
    const now = Date.now();
    
    let record = rateLimitStore.get(key);

    // Reset if window has passed
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, record);
    }

    // Increment count
    record.count++;

    // Set headers
    reply.header('X-RateLimit-Limit', max);
    reply.header('X-RateLimit-Remaining', Math.max(0, max - record.count));
    reply.header('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

    // Check limit
    if (record.count > max) {
      reply.header('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      throw new RateLimitError(
        `Too many requests. Please try again after ${Math.ceil((record.resetTime - now) / 1000)} seconds`
      );
    }

    // Cleanup old records periodically (every 100 requests)
    if (Math.random() < 0.01) {
      cleanupExpiredRecords();
    }
  };
}

/**
 * Cleanup expired records from store
 */
function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [key, record] of Array.from(rateLimitStore.entries())) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Common rate limit configurations
 */
export const RateLimitPresets = {
  /** Very strict: 5 requests per 15 minutes */
  strict: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
  /** Standard: 100 requests per 15 minutes */
  standard: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  /** Lenient: 1000 requests per hour */
  lenient: {
    windowMs: 60 * 60 * 1000,
    max: 1000,
  },
  /** Login attempts: 5 per 15 minutes */
  login: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
  /** File uploads: 10 per hour */
  fileUpload: {
    windowMs: 60 * 60 * 1000,
    max: 10,
  },
};
