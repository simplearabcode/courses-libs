/**
 * Transaction utilities for Prisma
 * 
 * Note: Uses generic types because each service has its own generated Prisma client
 */

// Using 'any' for generic Prisma transaction client type since each service generates its own client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrismaTransactionClient = any;
export type TransactionCallback<T> = (tx: PrismaTransactionClient) => Promise<T>;

/**
 * Execute operations within a database transaction
 * 
 * @example
 * ```typescript
 * await executeInTransaction(prisma, async (tx) => {
 *   const user = await tx.user.create({ data: userData });
 *   await tx.enrollment.create({ 
 *     data: { userId: user.id, courseId } 
 *   });
 *   return user;
 * });
 * ```
 */
export async function executeInTransaction<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  callback: TransactionCallback<T>,
  options?: {
    maxWait?: number; // Maximum time to wait for a transaction slot (ms)
    timeout?: number; // Maximum time the transaction can run (ms)
    isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
  }
): Promise<T> {
  return await prisma.$transaction(
    async (tx: PrismaTransactionClient) => {
      return await callback(tx);
    },
    options
  );
}

/**
 * Execute multiple operations in a single transaction with rollback support
 */
export async function executeMultipleInTransaction<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  operations: Array<(tx: PrismaTransactionClient) => Promise<unknown>>
): Promise<T[]> {
  return await prisma.$transaction(
    operations.map(op => async (tx: PrismaTransactionClient) => await op(tx))
  );
}

/**
 * Retry a transaction on deadlock or serialization errors
 */
export async function retryTransaction<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  callback: TransactionCallback<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
  } = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 100 } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await executeInTransaction(prisma, callback);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      lastError = error;
      
      // Check if error is retriable (deadlock or serialization failure)
      const isRetriable = 
        error.code === 'P2034' || // Transaction conflict
        error.code === 'P2028';   // Transaction already closed
      
      if (!isRetriable || attempt === maxRetries - 1) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
  }

  throw lastError;
}
