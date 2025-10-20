/**
 * Tests for transaction utilities
 */

import { executeInTransaction, retryTransaction } from './transaction.util';

describe('Transaction Utilities', () => {
  let mockPrisma: any;
  let mockTx: any;

  beforeEach(() => {
    mockTx = {
      user: {
        create: jest.fn(),
        update: jest.fn(),
      },
      enrollment: {
        create: jest.fn(),
      },
    };

    mockPrisma = {
      $transaction: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('executeInTransaction', () => {
    it('should execute callback within transaction', async () => {
      const userData = { email: 'test@example.com' };
      const expectedUser = { id: '123', ...userData };

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      mockTx.user.create.mockResolvedValue(expectedUser);

      const result = await executeInTransaction(mockPrisma, async (tx) => {
        return await tx.user.create({ data: userData });
      });

      expect(result).toEqual(expectedUser);
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockTx.user.create).toHaveBeenCalledWith({ data: userData });
    });

    it('should rollback on error', async () => {
      const error = new Error('Database error');

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      mockTx.user.create.mockRejectedValue(error);

      await expect(
        executeInTransaction(mockPrisma, async (tx) => {
          await tx.user.create({ data: {} });
        })
      ).rejects.toThrow('Database error');

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should support multiple operations in single transaction', async () => {
      const user = { id: '123', email: 'test@example.com' };
      const enrollment = { id: '456', userId: '123', courseId: '789' };

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      mockTx.user.create.mockResolvedValue(user);
      mockTx.enrollment.create.mockResolvedValue(enrollment);

      const result = await executeInTransaction(mockPrisma, async (tx) => {
        const newUser = await tx.user.create({ data: { email: 'test@example.com' } });
        const newEnrollment = await tx.enrollment.create({
          data: { userId: newUser.id, courseId: '789' },
        });
        return { user: newUser, enrollment: newEnrollment };
      });

      expect(result).toEqual({ user, enrollment });
      expect(mockTx.user.create).toHaveBeenCalledTimes(1);
      expect(mockTx.enrollment.create).toHaveBeenCalledTimes(1);
    });

    it('should pass transaction options', async () => {
      mockPrisma.$transaction.mockImplementation(async (callback: any, options: any) => {
        expect(options).toEqual({
          maxWait: 5000,
          timeout: 10000,
          isolationLevel: 'Serializable',
        });
        return await callback(mockTx);
      });

      await executeInTransaction(
        mockPrisma,
        async (tx) => {
          return tx.user.create({ data: {} });
        },
        {
          maxWait: 5000,
          timeout: 10000,
          isolationLevel: 'Serializable',
        }
      );

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('retryTransaction', () => {
    it('should succeed on first attempt', async () => {
      const expectedResult = { id: '123' };

      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return await callback(mockTx);
      });

      mockTx.user.create.mockResolvedValue(expectedResult);

      const result = await retryTransaction(mockPrisma, async (tx) => {
        return await tx.user.create({ data: {} });
      });

      expect(result).toEqual(expectedResult);
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should retry on transaction conflict (P2034)', async () => {
      const error = Object.assign(new Error('Transaction conflict'), {
        code: 'P2034',
      });
      const expectedResult = { id: '123' };

      mockPrisma.$transaction
        .mockRejectedValueOnce(error)
        .mockImplementation(async (callback: any) => {
          return await callback(mockTx);
        });

      mockTx.user.create.mockResolvedValue(expectedResult);

      const result = await retryTransaction(
        mockPrisma,
        async (tx) => {
          return await tx.user.create({ data: {} });
        },
        { maxRetries: 3, retryDelay: 10 }
      );

      expect(result).toEqual(expectedResult);
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(2);
    });

    it('should retry on transaction closed error (P2028)', async () => {
      const error = Object.assign(new Error('Transaction closed'), {
        code: 'P2028',
      });
      const expectedResult = { id: '123' };

      mockPrisma.$transaction
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockImplementation(async (callback: any) => {
          return await callback(mockTx);
        });

      mockTx.user.create.mockResolvedValue(expectedResult);

      const result = await retryTransaction(
        mockPrisma,
        async (tx) => {
          return await tx.user.create({ data: {} });
        },
        { maxRetries: 3, retryDelay: 10 }
      );

      expect(result).toEqual(expectedResult);
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(3);
    });

    it('should not retry on non-retriable errors', async () => {
      const error = Object.assign(new Error('Unique constraint violation'), {
        code: 'P2002',
      });

      mockPrisma.$transaction.mockRejectedValue(error);

      await expect(
        retryTransaction(
          mockPrisma,
          async (tx) => {
            return await tx.user.create({ data: {} });
          },
          { maxRetries: 3, retryDelay: 10 }
        )
      ).rejects.toThrow('Unique constraint violation');

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw after max retries', async () => {
      const error = Object.assign(new Error('Transaction conflict'), {
        code: 'P2034',
      });

      mockPrisma.$transaction.mockRejectedValue(error);

      await expect(
        retryTransaction(
          mockPrisma,
          async (tx) => {
            return await tx.user.create({ data: {} });
          },
          { maxRetries: 3, retryDelay: 10 }
        )
      ).rejects.toThrow('Transaction conflict');

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(3);
    });

    it('should respect retry delay', async () => {
      const error = Object.assign(new Error('Transaction conflict'), {
        code: 'P2034',
      });

      mockPrisma.$transaction.mockRejectedValue(error);

      await expect(
        retryTransaction(
          mockPrisma,
          async (tx) => {
            return await tx.user.create({ data: {} });
          },
          { maxRetries: 2, retryDelay: 10 }
        )
      ).rejects.toThrow('Transaction conflict');

      // Verify retries happened
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(2);
    });
  });
});
