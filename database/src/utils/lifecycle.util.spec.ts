/**
 * Tests for database lifecycle utilities
 */

import {
  gracefulShutdown,
  initializeDatabase,
  isConnected,
  ensureConnection,
} from './lifecycle.util';

describe('Lifecycle Utilities', () => {
  let mockPrisma: any;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockPrisma = {
      $disconnect: jest.fn(),
      $connect: jest.fn(),
      $queryRaw: jest.fn(),
    };

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('gracefulShutdown', () => {
    it('should disconnect successfully', async () => {
      mockPrisma.$disconnect.mockResolvedValue(undefined);

      await gracefulShutdown(mockPrisma);

      expect(mockPrisma.$disconnect).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('closing database connections')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('closed successfully')
      );
    });

    it('should log signal when provided', async () => {
      mockPrisma.$disconnect.mockResolvedValue(undefined);

      await gracefulShutdown(mockPrisma, 'SIGTERM');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('SIGTERM')
      );
    });

    it('should throw on disconnect error', async () => {
      const error = new Error('Disconnect failed');
      mockPrisma.$disconnect.mockRejectedValue(error);

      await expect(gracefulShutdown(mockPrisma)).rejects.toThrow(
        'Disconnect failed'
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error during database shutdown'),
        'Disconnect failed'
      );
    });
  });

  describe('initializeDatabase', () => {
    it('should connect successfully on first attempt', async () => {
      mockPrisma.$connect.mockResolvedValue(undefined);

      await initializeDatabase(mockPrisma);

      expect(mockPrisma.$connect).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('connected successfully')
      );
    });

    it('should retry on connection failure', async () => {
      mockPrisma.$connect
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValue(undefined);

      await initializeDatabase(mockPrisma, {
        maxRetries: 5,
        retryDelay: 10,
      });

      expect(mockPrisma.$connect).toHaveBeenCalledTimes(3);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    it('should call onRetry callback', async () => {
      const onRetry = jest.fn();
      
      mockPrisma.$connect
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValue(undefined);

      await initializeDatabase(mockPrisma, {
        maxRetries: 3,
        retryDelay: 10,
        onRetry,
      });

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
    });

    it('should throw after max retries', async () => {
      mockPrisma.$connect.mockRejectedValue(new Error('Connection failed'));

      await expect(
        initializeDatabase(mockPrisma, {
          maxRetries: 3,
          retryDelay: 10,
        })
      ).rejects.toThrow('Failed to connect to database after 3 attempts');

      expect(mockPrisma.$connect).toHaveBeenCalledTimes(3);
    });

    it('should wait between retries', async () => {
      jest.useFakeTimers();

      mockPrisma.$connect
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValue(undefined);

      const promise = initializeDatabase(mockPrisma, {
        maxRetries: 3,
        retryDelay: 100,
      });

      // First attempt fails
      await jest.advanceTimersByTimeAsync(0);
      
      // Wait for retry delay (100ms * 1)
      await jest.advanceTimersByTimeAsync(100);

      await promise;

      jest.useRealTimers();
    });
  });

  describe('isConnected', () => {
    it('should return true when connected', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

      const result = await isConnected(mockPrisma);

      expect(result).toBe(true);
    });

    it('should return false when not connected', async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error('Not connected'));

      const result = await isConnected(mockPrisma);

      expect(result).toBe(false);
    });
  });

  describe('ensureConnection', () => {
    it('should not reconnect if already connected', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

      await ensureConnection(mockPrisma);

      expect(mockPrisma.$connect).not.toHaveBeenCalled();
    });

    it('should reconnect if connection is lost', async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error('Not connected'));
      mockPrisma.$connect.mockResolvedValue(undefined);

      await ensureConnection(mockPrisma);

      expect(mockPrisma.$connect).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('connection lost')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Reconnected')
      );
    });
  });
});
