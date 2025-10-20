/**
 * Custom application error classes
 */

import { ErrorCode, ErrorMessages } from '../../../shared/src';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly statusCode = 500,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string, details?: Record<string, unknown>) {
    super(
      'VAL_2001' as ErrorCode,
      message,
      400,
      { field, ...details }
    );
  }
}

export class AuthenticationError extends AppError {
  constructor(code: ErrorCode, message?: string) {
    super(
      code,
      message || ErrorMessages[code] || 'Authentication failed',
      401
    );
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to access this resource') {
    super(
      'AUTH_1008' as ErrorCode,
      message,
      403
    );
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', message?: string) {
    super(
      'RES_3001' as ErrorCode,
      message || `${resource} not found`,
      404
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(
      'RES_3003' as ErrorCode,
      message,
      409
    );
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded. Please try again later') {
    super(
      'SRV_5004' as ErrorCode,
      message,
      429
    );
  }
}
