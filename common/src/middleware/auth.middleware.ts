/**
 * Authentication middleware for JWT verification
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthenticationError } from '../errors/app-error';
import { ErrorCodes } from '../../../shared/src';

export interface AuthUser {
  id: string;
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

/**
 * Extract JWT token from Authorization header
 */
export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  return null;
}

/**
 * Verify JWT token (placeholder - implement with your JWT library)
 * 
 * @example
 * ```typescript
 * import jwt from 'jsonwebtoken';
 * 
 * export async function verifyJWT(token: string): Promise<AuthUser> {
 *   try {
 *     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
 *     return {
 *       id: decoded.sub,
 *       userId: decoded.sub,
 *       email: decoded.email,
 *       role: decoded.role,
 *       sessionId: decoded.sessionId,
 *     };
 *   } catch (error) {
 *     throw new Error('Invalid token');
 *   }
 * }
 * ```
 */
export async function verifyJWT(_token: string): Promise<AuthUser> {
  // TODO: Implement with jsonwebtoken or your preferred library
  // For now, throw an error to remind developers to implement
  throw new Error('JWT verification not implemented. Please implement verifyJWT function.');
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 * 
 * @example
 * ```typescript
 * fastify.get('/profile', {
 *   preHandler: [authenticate]
 * }, async (request) => {
 *   return { user: request.user };
 * });
 * ```
 */
export async function authenticate(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  try {
    const token = extractToken(request.headers.authorization);

    if (!token) {
      throw new AuthenticationError(
        ErrorCodes.AUTH_TOKEN_EXPIRED,
        'No authentication token provided'
      );
    }

    const user = await verifyJWT(token);
    request.user = user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof AuthenticationError) {
      throw error;
    }

    throw new AuthenticationError(
      ErrorCodes.AUTH_TOKEN_EXPIRED,
      error.message || 'Invalid authentication token'
    );
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't throw if missing
 * 
 * @example
 * ```typescript
 * fastify.get('/courses', {
 *   preHandler: [optionalAuth]
 * }, async (request) => {
 *   // request.user may or may not exist
 *   const courses = await getCourses(request.user?.userId);
 *   return courses;
 * });
 * ```
 */
export async function optionalAuth(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  try {
    const token = extractToken(request.headers.authorization);
    if (token) {
      const user = await verifyJWT(token);
      request.user = user;
    }
  } catch {
    // Silently ignore authentication errors for optional auth
    request.user = undefined;
  }
}
