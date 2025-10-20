/**
 * Date and time utility functions
 */

export class DateUtil {
  /**
   * Format date to ISO string
   */
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Format date to readable string
   */
  static formatDate(date: Date, locale = 'en-US'): string {
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Format date and time
   */
  static formatDateTime(date: Date, locale = 'en-US'): string {
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Add days to a date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Add hours to a date
   */
  static addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  /**
   * Add minutes to a date
   */
  static addMinutes(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  /**
   * Subtract days from a date
   */
  static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days);
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Check if date is in the future
   */
  static isFuture(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Check if date is expired
   */
  static isExpired(date: Date): boolean {
    return this.isPast(date);
  }

  /**
   * Calculate duration between two dates in seconds
   */
  static calculateDuration(start: Date, end: Date): number {
    return Math.floor((end.getTime() - start.getTime()) / 1000);
  }

  /**
   * Calculate duration in minutes
   */
  static calculateDurationInMinutes(start: Date, end: Date): number {
    return Math.floor(this.calculateDuration(start, end) / 60);
  }

  /**
   * Calculate duration in hours
   */
  static calculateDurationInHours(start: Date, end: Date): number {
    return Math.floor(this.calculateDurationInMinutes(start, end) / 60);
  }

  /**
   * Calculate duration in days
   */
  static calculateDurationInDays(start: Date, end: Date): number {
    return Math.floor(this.calculateDurationInHours(start, end) / 24);
  }

  /**
   * Get start of day
   */
  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of day
   */
  static endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Check if two dates are on the same day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Get days between two dates
   */
  static getDaysBetween(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  /**
   * Check if date is within range
   */
  static isInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }

  /**
   * Format seconds to human readable duration (e.g., "2h 30m")
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  }

  /**
   * Get relative time string (e.g., "2 days ago", "in 3 hours")
   */
  static getRelativeTime(date: Date, locale = 'en'): string {
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(Math.abs(diffSeconds) / secondsInUnit);
      
      if (interval >= 1) {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        return rtf.format(
          diffSeconds > 0 ? -interval : interval,
          unit as Intl.RelativeTimeFormatUnit
        );
      }
    }

    return 'just now';
  }
}
