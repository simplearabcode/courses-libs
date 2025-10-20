/**
 * Tests for Prisma error handler
 */

import { 
  handlePrismaError, 
  isPrismaError, 
  getPrismaErrorMessage 
} from './error-handler.util';
import { ErrorCodes } from '@courses/shared';

describe('Prisma Error Handler', () => {
  describe('handlePrismaError', () => {
    it('should handle unique constraint violation (P2002)', () => {
      const error = {
        code: 'P2002',
        message: 'Unique constraint failed',
        meta: { target: ['email'] },
      };

      const result = handlePrismaError(error);

      expect(result.message).toContain('Duplicate entry for email');
      expect((result as any).code).toBe(ErrorCodes.RESOURCE_ALREADY_EXISTS);
      expect((result as any).statusCode).toBe(409);
    });

    it('should handle record not found (P2025)', () => {
      const error = {
        code: 'P2025',
        message: 'Record not found',
        meta: {},
      };

      const result = handlePrismaError(error);

      expect(result.message).toBe('Record not found');
      expect((result as any).code).toBe(ErrorCodes.RESOURCE_NOT_FOUND);
      expect((result as any).statusCode).toBe(404);
    });

    it('should handle foreign key violation (P2003)', () => {
      const error = {
        code: 'P2003',
        message: 'Foreign key constraint failed',
        meta: { target: 'courseId' },
      };

      const result = handlePrismaError(error);

      expect(result.message).toContain('Invalid reference for courseId');
      expect((result as any).code).toBe(ErrorCodes.VALIDATION_FAILED);
      expect((result as any).statusCode).toBe(400);
    });

    it('should handle value too long (P2000)', () => {
      const error = {
        code: 'P2000',
        message: 'Value too long',
        meta: { target: 'title' },
      };

      const result = handlePrismaError(error);

      expect(result.message).toContain('Value too long for field title');
      expect((result as any).code).toBe(ErrorCodes.VALIDATION_FAILED);
      expect((result as any).statusCode).toBe(400);
    });

    it('should handle null constraint violation (P2011)', () => {
      const error = {
        code: 'P2011',
        message: 'Null constraint violation',
        meta: { target: 'email' },
      };

      const result = handlePrismaError(error);

      expect(result.message).toContain('Required field email is missing');
      expect((result as any).code).toBe(ErrorCodes.VALIDATION_REQUIRED_FIELD);
      expect((result as any).statusCode).toBe(400);
    });

    it('should handle database connection errors (P1001)', () => {
      const error = {
        code: 'P1001',
        message: 'Cannot reach database',
        meta: {},
      };

      const result = handlePrismaError(error);

      expect(result.message).toBe('Database connection failed');
      expect((result as any).code).toBe(ErrorCodes.SERVER_DATABASE_ERROR);
      expect((result as any).statusCode).toBe(503);
    });

    it('should handle transaction conflict (P2034)', () => {
      const error = {
        code: 'P2034',
        message: 'Transaction conflict',
        meta: {},
      };

      const result = handlePrismaError(error);

      expect(result.message).toBe('Transaction conflict, please retry');
      expect((result as any).code).toBe(ErrorCodes.RESOURCE_CONFLICT);
      expect((result as any).statusCode).toBe(409);
    });

    it('should handle query timeout (P2024)', () => {
      const error = {
        code: 'P2024',
        message: 'Query timeout',
        meta: {},
      };

      const result = handlePrismaError(error);

      expect(result.message).toBe('Query timeout exceeded');
      expect((result as any).code).toBe(ErrorCodes.SERVER_DATABASE_ERROR);
      expect((result as any).statusCode).toBe(408);
    });

    it('should handle unknown Prisma errors', () => {
      const error = {
        code: 'P9999',
        message: 'Unknown error',
        meta: {},
      };

      const result = handlePrismaError(error);

      expect(result.message).toBe('Unknown error');
      expect((result as any).code).toBe(ErrorCodes.SERVER_DATABASE_ERROR);
      expect((result as any).statusCode).toBe(500);
      expect((result as any).details).toEqual({ code: 'P9999' });
    });

    it('should return original error if no code', () => {
      const error = new Error('Regular error');

      const result = handlePrismaError(error);

      expect(result).toBe(error);
    });

    it('should handle array targets in constraint errors', () => {
      const error = {
        code: 'P2002',
        message: 'Unique constraint failed',
        meta: { target: ['email', 'username'] },
      };

      const result = handlePrismaError(error);

      expect(result.message).toContain('email, username');
    });
  });

  describe('isPrismaError', () => {
    it('should return true for Prisma errors', () => {
      const error = {
        code: 'P2002',
        message: 'Error',
      };

      expect(isPrismaError(error)).toBe(true);
    });

    it('should return false for non-Prisma errors', () => {
      const error = new Error('Regular error');

      expect(isPrismaError(error)).toBe(false);
    });

    it('should return false for errors with non-P codes', () => {
      const error = {
        code: 'E001',
        message: 'Error',
      };

      expect(isPrismaError(error)).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isPrismaError(null)).toBeFalsy();
      expect(isPrismaError(undefined)).toBeFalsy();
    });
  });

  describe('getPrismaErrorMessage', () => {
    it('should return handled message for Prisma errors', () => {
      const error = {
        code: 'P2025',
        message: 'Record not found',
        meta: {},
      };

      const message = getPrismaErrorMessage(error);

      expect(message).toBe('Record not found');
    });

    it('should return original message for non-Prisma errors', () => {
      const error = new Error('Regular error');

      const message = getPrismaErrorMessage(error);

      expect(message).toBe('Regular error');
    });

    it('should return default message if no message', () => {
      const error = {};

      const message = getPrismaErrorMessage(error);

      expect(message).toBe('An error occurred');
    });
  });
});
