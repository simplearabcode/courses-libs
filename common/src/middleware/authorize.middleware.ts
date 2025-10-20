/**
 * Authorization middleware for role-based access control (RBAC)
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthorizationError } from '../errors/app-error';
import { Role, hasPermission } from '../../../shared/src';

/**
 * Require authentication
 * Throws if user is not authenticated
 */
export async function requireAuth(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    throw new AuthorizationError('Authentication required');
  }
}

/**
 * Require specific role(s)
 * 
 * @example
 * ```typescript
 * // Instructors only
 * fastify.post('/courses', {
 *   preHandler: [authenticate, requireRole(Role.INSTRUCTOR)]
 * }, async (request) => {
 *   // Only instructors can create courses
 * });
 * 
 * // Instructors or Admins
 * fastify.delete('/courses/:id', {
 *   preHandler: [authenticate, requireRole(Role.INSTRUCTOR, Role.ADMIN)]
 * }, async (request) => {
 *   // Instructors or admins can delete
 * });
 * ```
 */
export function requireRole(...roles: Role[]) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new AuthorizationError('Authentication required');
    }

    const userRole = request.user.role as Role;
    
    if (!roles.includes(userRole)) {
      throw new AuthorizationError(
        `Access denied. Required role: ${roles.join(' or ')}`
      );
    }
  };
}

/**
 * Require specific permission
 * 
 * @example
 * ```typescript
 * fastify.delete('/courses/:id', {
 *   preHandler: [authenticate, requirePermission('courses:delete')]
 * }, async (request) => {
 *   // Only users with 'courses:delete' permission
 * });
 * ```
 */
export function requirePermission(permission: string) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new AuthorizationError('Authentication required');
    }

    const userRole = request.user.role as Role;
    
    if (!hasPermission(userRole, permission)) {
      throw new AuthorizationError(
        `Access denied. Missing permission: ${permission}`
      );
    }
  };
}

/**
 * Require resource ownership
 * User must own the resource OR be an admin
 * 
 * @example
 * ```typescript
 * fastify.put('/enrollments/:id', {
 *   preHandler: [
 *     authenticate,
 *     requireOwnership(async (request) => {
 *       const enrollment = await getEnrollment(request.params.id);
 *       return enrollment.studentId;
 *     })
 *   ]
 * }, async (request) => {
 *   // Only the student who owns this enrollment (or admin) can update it
 * });
 * ```
 */
export function requireOwnership(
  getResourceOwnerId: (request: FastifyRequest) => Promise<string>
) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new AuthorizationError('Authentication required');
    }

    const ownerId = await getResourceOwnerId(request);
    const userRole = request.user.role as Role;

    // Allow if user owns the resource OR is an admin
    if (request.user.userId !== ownerId && userRole !== Role.ADMIN) {
      throw new AuthorizationError(
        'Access denied. You can only access your own resources'
      );
    }
  };
}

/**
 * Require admin role
 * Shorthand for requireRole(Role.ADMIN)
 */
export const requireAdmin = requireRole(Role.ADMIN);

/**
 * Require instructor or admin role
 * Common pattern for content management
 */
export const requireInstructor = requireRole(Role.INSTRUCTOR, Role.ADMIN);

/**
 * Check if current user is the resource owner
 * Returns boolean instead of throwing
 */
export async function isOwner(
  request: FastifyRequest,
  resourceOwnerId: string
): Promise<boolean> {
  if (!request.user) return false;
  
  const userRole = request.user.role as Role;
  return request.user.userId === resourceOwnerId || userRole === Role.ADMIN;
}
