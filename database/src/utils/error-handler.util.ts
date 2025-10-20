/**
 * Prisma error handler utilities
 */

import { ErrorCodes } from '@courses/shared';

export interface PrismaError extends Error {
  code: string;
  meta?: Record<string, unknown>;
  clientVersion?: string;
}

/**
 * Handle Prisma-specific errors and convert to application errors
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handlePrismaError(error: any): Error {
  if (!error.code) {
    return error;
  }

  const prismaError = error as PrismaError;

  switch (prismaError.code) {
    // Unique constraint violation
    case 'P2002':
      return createError(
        ErrorCodes.RESOURCE_ALREADY_EXISTS,
        `Duplicate entry for ${getConstraintFields(prismaError)}`,
        409,
        { field: getConstraintFields(prismaError) }
      );

    // Record not found
    case 'P2025':
      return createError(
        ErrorCodes.RESOURCE_NOT_FOUND,
        'Record not found',
        404
      );

    // Foreign key constraint violation
    case 'P2003':
      return createError(
        ErrorCodes.VALIDATION_FAILED,
        `Invalid reference for ${getConstraintFields(prismaError)}`,
        400,
        { field: getConstraintFields(prismaError) }
      );

    // Record required but not found
    case 'P2018':
      return createError(
        ErrorCodes.RESOURCE_NOT_FOUND,
        'Required record not found',
        404
      );

    // Value out of range
    case 'P2020':
      return createError(
        ErrorCodes.VALIDATION_FAILED,
        'Value out of valid range',
        400
      );

    // Value too long
    case 'P2000':
      return createError(
        ErrorCodes.VALIDATION_FAILED,
        `Value too long for field ${getConstraintFields(prismaError)}`,
        400,
        { field: getConstraintFields(prismaError) }
      );

    // Null constraint violation
    case 'P2011':
      return createError(
        ErrorCodes.VALIDATION_REQUIRED_FIELD,
        `Required field ${getConstraintFields(prismaError)} is missing`,
        400,
        { field: getConstraintFields(prismaError) }
      );

    // Database connection error
    case 'P1001':
    case 'P1002':
    case 'P1008':
    case 'P1017':
      return createError(
        ErrorCodes.SERVER_DATABASE_ERROR,
        'Database connection failed',
        503
      );

    // Transaction conflict
    case 'P2034':
      return createError(
        ErrorCodes.RESOURCE_CONFLICT,
        'Transaction conflict, please retry',
        409
      );

    // Query timeout
    case 'P2024':
      return createError(
        ErrorCodes.SERVER_DATABASE_ERROR,
        'Query timeout exceeded',
        408
      );

    // Default database error
    default:
      return createError(
        ErrorCodes.SERVER_DATABASE_ERROR,
        prismaError.message || 'Database operation failed',
        500,
        { code: prismaError.code }
      );
  }
}

/**
 * Create a standardized error object
 */
function createError(
  code: string,
  message: string,
  statusCode: number,
  details?: Record<string, unknown>
): Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

/**
 * Extract constraint field names from Prisma error metadata
 */
function getConstraintFields(error: PrismaError): string {
  if (!error.meta?.target) return 'unknown';
  
  const target = error.meta.target;
  
  if (Array.isArray(target)) {
    return target.join(', ');
  }
  
  return String(target);
}

/**
 * Check if an error is a Prisma error
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPrismaError(error: any): error is PrismaError {
  return error && typeof error.code === 'string' && error.code.startsWith('P');
}

/**
 * Get user-friendly error message from Prisma error
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPrismaErrorMessage(error: any): string {
  if (!isPrismaError(error)) {
    return error.message || 'An error occurred';
  }

  const handledError = handlePrismaError(error);
  return handledError.message;
}
