/**
 * Tests for database health check utilities
 */

import {
  checkDatabaseHealth,
  checkDatabaseHealthWithTimeout,
  pingDatabase,
  getDatabaseInfo,
} from './health-check.util';

describe('Health Check Utilities', () => {
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkDatabaseHealth', () => {
    it('should return healthy status on successful connection', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

      const result = await checkDatabaseHealth(mockPrisma);

      expect(result.status).toBe('healthy');
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
      expect(result.details).toEqual({
        canConnect: true,
        canQuery: true,
        latency: expect.any(Number),
      });
    });

    it('should return unhealthy status on connection failure', async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error('Connection failed'));

      const result = await checkDatabaseHealth(mockPrisma);

      expect(result.status).toBe('unhealthy');
      expect(result.error).toBe('Connection failed');
      expect(result.details).toEqual({
        canConnect: false,
        canQuery: false,
        latency: expect.any(Number),
      });
    });

    it('should measure response time', async () => {
      mockPrisma.$queryRaw.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve([{ result: 1 }]), 50);
        });
      });

      const result = await checkDatabaseHealth(mockPrisma);

      expect(result.status).toBe('healthy');
      expect(result.responseTime).toBeGreaterThanOrEqual(50);
    });
  });

  describe('checkDatabaseHealthWithTimeout', () => {
    it('should return healthy status within timeout', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

      const result = await checkDatabaseHealthWithTimeout(mockPrisma, 1000);

      expect(result.status).toBe('healthy');
    });

    it('should return unhealthy status on timeout', async () => {
      jest.useFakeTimers();

      mockPrisma.$queryRaw.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve([{ result: 1 }]), 2000);
        });
      });

      const promise = checkDatabaseHealthWithTimeout(mockPrisma, 500);

      jest.advanceTimersByTime(500);

      const result = await promise;

      expect(result.status).toBe('unhealthy');
      expect(result.error).toContain('timeout');

      jest.useRealTimers();
    });
  });

  describe('pingDatabase', () => {
    it('should return true on successful ping', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

      const result = await pingDatabase(mockPrisma);

      expect(result).toBe(true);
      expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    });

    it('should return false on failed ping', async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error('Connection failed'));

      const result = await pingDatabase(mockPrisma);

      expect(result).toBe(false);
    });
  });

  describe('getDatabaseInfo', () => {
    it('should return database version on success', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([
        { version: 'PostgreSQL 14.5' },
      ]);

      const result = await getDatabaseInfo(mockPrisma);

      expect(result.connected).toBe(true);
      expect(result.version).toBe('PostgreSQL 14.5');
    });

    it('should return disconnected status on failure', async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error('Connection failed'));

      const result = await getDatabaseInfo(mockPrisma);

      expect(result.connected).toBe(false);
      expect(result.version).toBeUndefined();
    });

    it('should handle missing version', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{}]);

      const result = await getDatabaseInfo(mockPrisma);

      expect(result.connected).toBe(true);
      expect(result.version).toBeUndefined();
    });
  });
});
