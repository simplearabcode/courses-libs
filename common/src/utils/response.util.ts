/**
 * Response builder utilities for consistent API responses
 */

import { IApiResponse, IPaginatedResponse, IPagination } from '../../../shared/src';

/**
 * Build a success response
 * 
 * @example
 * ```typescript
 * return successResponse(user, 'User created successfully');
 * // {
 * //   success: true,
 * //   message: 'User created successfully',
 * //   data: { ...user }
 * // }
 * ```
 */
export function successResponse<T>(
  data: T,
  message = 'Success'
): IApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Build a paginated response
 * 
 * @example
 * ```typescript
 * const meta = new PaginationMeta(page, limit, total);
 * return paginatedResponse(courses, meta, 'Courses retrieved');
 * // {
 * //   success: true,
 * //   message: 'Courses retrieved',
 * //   data: [...courses],
 * //   pagination: { page, limit, total, ... }
 * // }
 * ```
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: IPagination
): IPaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination,
  };
}

/**
 * Build an error response
 * Usually not needed as error handler middleware handles this
 * But useful for manual error responses
 * 
 * @example
 * ```typescript
 * return reply.status(400).send(
 *   errorResponse('VAL_2001', 'Invalid input', { field: 'email' })
 * );
 * ```
 */
export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>
): IApiResponse {
  return {
    success: false,
    message,
    error: {
      code,
      message,
      details,
    },
  };
}

/**
 * Build a created response (201)
 * Convenience wrapper for resource creation
 */
export function createdResponse<T>(
  data: T,
  message = 'Resource created successfully'
): IApiResponse<T> {
  return successResponse(data, message);
}

/**
 * Build a no content response (204)
 * For operations that don't return data (like DELETE)
 */
export function noContentResponse(
  message = 'Operation completed successfully'
): IApiResponse<null> {
  return {
    success: true,
    message,
    data: null,
  };
}
