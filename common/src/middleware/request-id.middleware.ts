/**
 * Request ID middleware for request tracking
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
  }
}

/**
 * Request ID middleware
 * Generates or extracts request ID for tracing
 * 
 * @example
 * ```typescript
 * // Add to all routes
 * fastify.addHook('preHandler', requestId);
 * 
 * // Use in handlers
 * fastify.get('/api/courses', async (request) => {
 *   request.log.info({ requestId: request.requestId }, 'Fetching courses');
 *   return courses;
 * });
 * ```
 */
export async function requestId(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Use existing request ID from header or generate new one
  const id = 
    (request.headers['x-request-id'] as string) ||
    (request.headers['x-correlation-id'] as string) ||
    randomUUID();

  request.requestId = id;
  
  // Add to response headers for client tracking
  reply.header('x-request-id', id);
}

/**
 * Get or generate request ID
 * Useful for manual request ID generation
 */
export function getRequestId(request: FastifyRequest): string {
  return request.requestId || randomUUID();
}
