/**
 * Database lifecycle management utilities
 * 
 * Note: Uses generic types because each service has its own generated Prisma client
 */

/**
 * Gracefully shutdown database connection
 */
export async function gracefulShutdown(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  signal?: string
): Promise<void> {
  const signalMessage = signal ? `${signal} received` : 'Shutdown initiated';
  console.log(`${signalMessage}, closing database connections...`);
  
  try {
    await prisma.$disconnect();
    console.log('✅ Database connections closed successfully');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('❌ Error during database shutdown:', error.message);
    throw error;
  }
}

/**
 * Setup graceful shutdown handlers
 */
export function setupShutdownHandlers(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any
): void {
  // Handle process termination signals
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
  
  signals.forEach(signal => {
    process.on(signal, async () => {
      await gracefulShutdown(prisma, signal);
      process.exit(0);
    });
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await gracefulShutdown(prisma, 'UnhandledRejection');
    process.exit(1);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await gracefulShutdown(prisma, 'UncaughtException');
    process.exit(1);
  });
}

/**
 * Initialize database connection with retry logic
 */
export async function initializeDatabase(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<void> {
  const { maxRetries = 5, retryDelay = 2000, onRetry } = options;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`❌ Database connection attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (onRetry) {
        onRetry(attempt, error);
      }

      if (attempt === maxRetries) {
        throw new Error(`Failed to connect to database after ${maxRetries} attempts`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }
}

/**
 * Check if Prisma client is connected
 */
export async function isConnected(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any
): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Reconnect to database if connection is lost
 */
export async function ensureConnection(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any
): Promise<void> {
  const connected = await isConnected(prisma);
  
  if (!connected) {
    console.log('Database connection lost, reconnecting...');
    await prisma.$connect();
    console.log('✅ Reconnected to database');
  }
}
