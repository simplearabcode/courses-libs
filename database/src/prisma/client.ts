/**
 * Prisma client factory for multiple databases
 */

// Using 'any' for generic Prisma client type since each service generates its own client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrismaClient = any;

export interface IPrismaClientOptions {
  databaseUrl: string;
  enableLogging?: boolean;
}

/**
 * Create a Prisma client instance for a specific database
 * Note: This is a generic helper. Each service should use its own generated Prisma client.
 */
export function createPrismaClient(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaClientConstructor: any,
  options: IPrismaClientOptions
): PrismaClient {
  const { databaseUrl, enableLogging = process.env.NODE_ENV !== 'production' } = options;

  const client = new PrismaClientConstructor({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: enableLogging
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'error' },
          { emit: 'stdout', level: 'info' },
          { emit: 'stdout', level: 'warn' },
        ]
      : ['error'],
  });

  return client;
}

/**
 * Prisma client manager for handling multiple database connections
 * 
 * NOTE: This is a generic utility. Each service should manage its own Prisma client
 * using the service-specific generated client.
 */
export class PrismaClientManager {
  private static clients: Map<string, PrismaClient> = new Map();

  static getClient(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PrismaClientConstructor: any,
    databaseUrl: string
  ): PrismaClient {
    if (!this.clients.has(name)) {
      const client = createPrismaClient(PrismaClientConstructor, { databaseUrl });
      this.clients.set(name, client);
    }
    const client = this.clients.get(name);
    if (!client) {
      throw new Error(`Failed to get Prisma client for ${name}`);
    }
    return client;
  }

  static async disconnectAll(): Promise<void> {
    const disconnectPromises = Array.from(this.clients.values()).map((client) =>
      client.$disconnect()
    );
    await Promise.all(disconnectPromises);
    this.clients.clear();
  }
}
