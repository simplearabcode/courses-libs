/**
 * Date Utility Tests
 */

import { DateUtil } from './date.util';

describe('DateUtil', () => {
  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const isoString = DateUtil.toISOString(date);

      expect(isoString).toBe('2024-01-01T12:00:00.000Z');
    });
  });

  describe('formatDate', () => {
    it('should format date', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const formatted = DateUtil.formatDate(date, 'en-US');

      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('addDays', () => {
    it('should add days to a date', () => {
      const date = new Date('2024-01-01');
      const newDate = DateUtil.addDays(date, 5);

      expect(newDate.getDate()).toBe(6);
    });

    it('should handle month overflow', () => {
      const date = new Date('2024-01-30');
      const newDate = DateUtil.addDays(date, 5);

      expect(newDate.getMonth()).toBe(1); // February
      expect(newDate.getDate()).toBe(4);
    });
  });

  describe('addHours', () => {
    it('should add hours to a date', () => {
      const date = new Date(2024, 0, 1, 10, 0, 0); // Jan 1, 2024, 10:00:00
      const newDate = DateUtil.addHours(date, 5);

      expect(newDate.getHours()).toBe(15);
    });
  });

  describe('addMinutes', () => {
    it('should add minutes to a date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const newDate = DateUtil.addMinutes(date, 30);

      expect(newDate.getMinutes()).toBe(30);
    });
  });

  describe('subtractDays', () => {
    it('should subtract days from a date', () => {
      const date = new Date('2024-01-10');
      const newDate = DateUtil.subtractDays(date, 5);

      expect(newDate.getDate()).toBe(5);
    });
  });

  describe('isPast', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(DateUtil.isPast(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date('2099-01-01');
      expect(DateUtil.isPast(futureDate)).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('should return true for future dates', () => {
      const futureDate = new Date('2099-01-01');
      expect(DateUtil.isFuture(futureDate)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(DateUtil.isFuture(pastDate)).toBe(false);
    });
  });

  describe('isExpired', () => {
    it('should return true for expired dates', () => {
      const expiredDate = new Date('2020-01-01');
      expect(DateUtil.isExpired(expiredDate)).toBe(true);
    });

    it('should return false for non-expired dates', () => {
      const futureDate = new Date('2099-01-01');
      expect(DateUtil.isExpired(futureDate)).toBe(false);
    });
  });

  describe('calculateDuration', () => {
    it('should calculate duration in seconds', () => {
      const start = new Date('2024-01-01T10:00:00Z');
      const end = new Date('2024-01-01T10:05:00Z');
      const duration = DateUtil.calculateDuration(start, end);

      expect(duration).toBe(300); // 5 minutes = 300 seconds
    });
  });

  describe('calculateDurationInMinutes', () => {
    it('should calculate duration in minutes', () => {
      const start = new Date('2024-01-01T10:00:00Z');
      const end = new Date('2024-01-01T11:30:00Z');
      const duration = DateUtil.calculateDurationInMinutes(start, end);

      expect(duration).toBe(90);
    });
  });

  describe('calculateDurationInHours', () => {
    it('should calculate duration in hours', () => {
      const start = new Date('2024-01-01T10:00:00Z');
      const end = new Date('2024-01-01T15:00:00Z');
      const duration = DateUtil.calculateDurationInHours(start, end);

      expect(duration).toBe(5);
    });
  });

  describe('calculateDurationInDays', () => {
    it('should calculate duration in days', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-06');
      const duration = DateUtil.calculateDurationInDays(start, end);

      expect(duration).toBe(5);
    });
  });

  describe('startOfDay', () => {
    it('should return start of day', () => {
      const date = new Date('2024-01-01T15:30:45Z');
      const startOfDay = DateUtil.startOfDay(date);

      expect(startOfDay.getHours()).toBe(0);
      expect(startOfDay.getMinutes()).toBe(0);
      expect(startOfDay.getSeconds()).toBe(0);
      expect(startOfDay.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('should return end of day', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const endOfDay = DateUtil.endOfDay(date);

      expect(endOfDay.getHours()).toBe(23);
      expect(endOfDay.getMinutes()).toBe(59);
      expect(endOfDay.getSeconds()).toBe(59);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-01T15:00:00Z');

      expect(DateUtil.isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date(2024, 0, 1, 23, 59, 59); // Jan 1, 2024
      const date2 = new Date(2024, 0, 2, 0, 0, 1);     // Jan 2, 2024

      expect(DateUtil.isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('getDaysBetween', () => {
    it('should calculate days between dates', () => {
      const start = new Date(2024, 0, 1); // Jan 1, 2024
      const end = new Date(2024, 0, 10);   // Jan 10, 2024
      const days = DateUtil.getDaysBetween(start, end);

      expect(days).toBe(9);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(DateUtil.isToday(today)).toBe(true);
    });

    it('should return false for other days', () => {
      const yesterday = DateUtil.subtractDays(new Date(), 1);
      expect(DateUtil.isToday(yesterday)).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should return true for date in range', () => {
      const date = new Date('2024-06-15');
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');

      expect(DateUtil.isInRange(date, start, end)).toBe(true);
    });

    it('should return false for date out of range', () => {
      const date = new Date('2025-01-01');
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');

      expect(DateUtil.isInRange(date, start, end)).toBe(false);
    });
  });

  describe('formatDuration', () => {
    it('should format seconds to readable duration', () => {
      expect(DateUtil.formatDuration(3665)).toBe('1h 1m 5s');
      expect(DateUtil.formatDuration(90)).toBe('1m 30s');
      expect(DateUtil.formatDuration(45)).toBe('45s');
    });

    it('should handle zero duration', () => {
      expect(DateUtil.formatDuration(0)).toBe('0s');
    });
  });

  describe('getRelativeTime', () => {
    it('should return relative time for past dates', () => {
      const pastDate = DateUtil.subtractDays(new Date(), 2);
      const relativeTime = DateUtil.getRelativeTime(pastDate);

      expect(relativeTime).toContain('ago');
    });

    it('should return "just now" for very recent dates', () => {
      const now = new Date();
      const relativeTime = DateUtil.getRelativeTime(now);

      expect(relativeTime).toBe('just now');
    });
  });
});
