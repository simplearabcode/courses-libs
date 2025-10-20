/**
 * Logging utility using Pino
 */

import pino from 'pino';

export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

export function createLogger(serviceName: string): ILogger {
  const pinoLogger = pino({
    name: serviceName,
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  });

  return {
    info(message: string, context?: Record<string, unknown>) {
      pinoLogger.info(context || {}, message);
    },

    warn(message: string, context?: Record<string, unknown>) {
      pinoLogger.warn(context || {}, message);
    },

    error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
      if (error instanceof Error) {
        pinoLogger.error({ ...context, err: error }, message);
      } else {
        pinoLogger.error({ ...context, error }, message);
      }
    },

    debug(message: string, context?: Record<string, unknown>) {
      pinoLogger.debug(context || {}, message);
    },
  };
}
