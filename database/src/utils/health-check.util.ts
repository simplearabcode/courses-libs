/**
 * Database health check utilities
 * 
 * Note: Uses generic types because each service has its own generated Prisma client
 */

export interface IHealthCheckResult {
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
  details?: {
    canConnect: boolean;
    canQuery: boolean;
    latency: number;
  };
}

/**
 * Check if database connection is healthy
 */
export async function checkDatabaseHealth(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any
): Promise<IHealthCheckResult> {
  const startTime = Date.now();

  try {
    // Test connection with simple query
    await prisma.$queryRaw`SELECT 1`;
    
    const responseTime = Date.now() - startTime;

    return {
      status: 'healthy',
      responseTime,
      details: {
        canConnect: true,
        canQuery: true,
        latency: responseTime,
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error.message || 'Database health check failed',
      details: {
        canConnect: false,
        canQuery: false,
        latency: Date.now() - startTime,
      },
    };
  }
}

/**
 * Check database connection with timeout
 */
export async function checkDatabaseHealthWithTimeout(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  timeoutMs = 5000
): Promise<IHealthCheckResult> {
  return Promise.race([
    checkDatabaseHealth(prisma),
    new Promise<IHealthCheckResult>((resolve) => 
      setTimeout(() => resolve({
        status: 'unhealthy',
        error: `Health check timeout after ${timeoutMs}ms`,
        details: {
          canConnect: false,
          canQuery: false,
          latency: timeoutMs,
        },
      }), timeoutMs)
    ),
  ]);
}

/**
 * Ping database to check connection
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function pingDatabase(prisma: any): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Get database connection info
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDatabaseInfo(prisma: any): Promise<{
  version?: string;
  connected: boolean;
  activeConnections?: number;
}> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await prisma.$queryRaw`SELECT version()`;
    const version = result[0]?.version;

    return {
      version,
      connected: true,
    };
  } catch {
    return {
      connected: false,
    };
  }
}
