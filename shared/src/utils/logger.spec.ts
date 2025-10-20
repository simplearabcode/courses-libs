/**
 * Logger Utility Tests
 */

import { createLogger, ILogger } from './logger';

describe('createLogger', () => {
  let logger: ILogger;

  beforeEach(() => {
    logger = createLogger('test-service');
  });

  it('should create a logger instance', () => {
    expect(logger).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.debug).toBeDefined();
  });

  describe('info', () => {
    it('should log info message', () => {
      expect(() => {
        logger.info('Test info message');
      }).not.toThrow();
    });

    it('should log info message with context', () => {
      expect(() => {
        logger.info('Test info message', { userId: '123', action: 'test' });
      }).not.toThrow();
    });
  });

  describe('warn', () => {
    it('should log warn message', () => {
      expect(() => {
        logger.warn('Test warn message');
      }).not.toThrow();
    });

    it('should log warn message with context', () => {
      expect(() => {
        logger.warn('Test warn message', { userId: '123' });
      }).not.toThrow();
    });
  });

  describe('error', () => {
    it('should log error message', () => {
      expect(() => {
        logger.error('Test error message');
      }).not.toThrow();
    });

    it('should log error message with Error object', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.error('Test error message', error);
      }).not.toThrow();
    });

    it('should log error message with context', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.error('Test error message', error, { userId: '123' });
      }).not.toThrow();
    });

    it('should log error message with non-Error object', () => {
      expect(() => {
        logger.error('Test error message', { code: 'ERR_001' });
      }).not.toThrow();
    });
  });

  describe('debug', () => {
    it('should log debug message', () => {
      expect(() => {
        logger.debug('Test debug message');
      }).not.toThrow();
    });

    it('should log debug message with context', () => {
      expect(() => {
        logger.debug('Test debug message', { data: { test: true } });
      }).not.toThrow();
    });
  });
});
