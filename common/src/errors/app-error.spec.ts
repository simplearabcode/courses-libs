/**
 * AppError Tests
 */

import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
} from './app-error';

describe('AppError', () => {
  it('should create an error with all properties', () => {
    const error = new AppError('SRV_5001', 'Test error message', 400, {
      field: 'email',
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('SRV_5001');
    expect(error.message).toBe('Test error message');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ field: 'email' });
    expect(error.name).toBe('AppError');
  });

  it('should default statusCode to 500', () => {
    const error = new AppError('SRV_5001', 'Test error');

    expect(error.statusCode).toBe(500);
  });

  it('should capture stack trace', () => {
    const error = new AppError('SRV_5001', 'Test error');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('AppError');
  });
});

describe('ValidationError', () => {
  it('should create a validation error', () => {
    const error = new ValidationError('Invalid email format', 'email');

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('VAL_2001');
    expect(error.message).toBe('Invalid email format');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ field: 'email' });
  });

  it('should create a validation error without field', () => {
    const error = new ValidationError('Validation failed');

    expect(error.code).toBe('VAL_2001');
    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
    expect(error.details?.field).toBeUndefined();
  });

  it('should merge additional details', () => {
    const error = new ValidationError('Invalid input', 'email', {
      pattern: '^[a-z]+$',
    });

    expect(error.details).toEqual({ field: 'email', pattern: '^[a-z]+$' });
  });
});

describe('AuthenticationError', () => {
  it('should create an authentication error with code', () => {
    const error = new AuthenticationError('AUTH_1001', 'Invalid credentials');

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('AUTH_1001');
    expect(error.message).toBe('Invalid credentials');
    expect(error.statusCode).toBe(401);
  });

  it('should use default message when not provided', () => {
    const error = new AuthenticationError('AUTH_1001');

    expect(error.message).toBeDefined();
    expect(error.statusCode).toBe(401);
  });
});

describe('AuthorizationError', () => {
  it('should create an authorization error with default message', () => {
    const error = new AuthorizationError();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('AUTH_1008');
    expect(error.message).toBe('You do not have permission to access this resource');
    expect(error.statusCode).toBe(403);
  });

  it('should create an authorization error with custom message', () => {
    const error = new AuthorizationError('Insufficient permissions');

    expect(error.code).toBe('AUTH_1008');
    expect(error.message).toBe('Insufficient permissions');
    expect(error.statusCode).toBe(403);
  });
});

describe('NotFoundError', () => {
  it('should create a not found error with default resource', () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('RES_3001');
    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create a not found error with custom resource', () => {
    const error = new NotFoundError('User');

    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create a not found error with custom message', () => {
    const error = new NotFoundError('User', 'User with ID 123 not found');

    expect(error.message).toBe('User with ID 123 not found');
    expect(error.statusCode).toBe(404);
  });
});

describe('ConflictError', () => {
  it('should create a conflict error', () => {
    const error = new ConflictError('Email already exists');

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('RES_3003');
    expect(error.message).toBe('Email already exists');
    expect(error.statusCode).toBe(409);
  });

  it('should handle resource conflicts', () => {
    const error = new ConflictError('Course enrollment already exists');

    expect(error.message).toBe('Course enrollment already exists');
    expect(error.statusCode).toBe(409);
  });
});

describe('RateLimitError', () => {
  it('should create a rate limit error with default message', () => {
    const error = new RateLimitError();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('SRV_5004');
    expect(error.message).toBe('Rate limit exceeded. Please try again later');
    expect(error.statusCode).toBe(429);
  });

  it('should create a rate limit error with custom message', () => {
    const error = new RateLimitError('Too many login attempts');

    expect(error.message).toBe('Too many login attempts');
    expect(error.statusCode).toBe(429);
  });
});

describe('Error inheritance', () => {
  it('should maintain instanceof relationships', () => {
    const validationError = new ValidationError('Test');
    const authError = new AuthenticationError('AUTH_1001');
    const notFoundError = new NotFoundError();

    expect(validationError instanceof AppError).toBe(true);
    expect(validationError instanceof Error).toBe(true);
    expect(authError instanceof AppError).toBe(true);
    expect(authError instanceof Error).toBe(true);
    expect(notFoundError instanceof AppError).toBe(true);
    expect(notFoundError instanceof Error).toBe(true);
  });

  it('should have correct constructor names', () => {
    expect(new ValidationError('Test').name).toBe('ValidationError');
    expect(new AuthenticationError('AUTH_1001').name).toBe('AuthenticationError');
    expect(new AuthorizationError().name).toBe('AuthorizationError');
    expect(new NotFoundError().name).toBe('NotFoundError');
    expect(new ConflictError('Test').name).toBe('ConflictError');
    expect(new RateLimitError().name).toBe('RateLimitError');
  });
});
