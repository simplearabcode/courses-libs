/**
 * Validation Utility Tests
 */

import { ValidationUtil } from './validation.util';

describe('ValidationUtil', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(ValidationUtil.isValidEmail('user@example.com')).toBe(true);
      expect(ValidationUtil.isValidEmail('test.user@domain.co.uk')).toBe(true);
      expect(ValidationUtil.isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(ValidationUtil.isValidEmail('invalid')).toBe(false);
      expect(ValidationUtil.isValidEmail('user@')).toBe(false);
      expect(ValidationUtil.isValidEmail('@domain.com')).toBe(false);
      expect(ValidationUtil.isValidEmail('user @domain.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(ValidationUtil.isValidUrl('https://example.com')).toBe(true);
      expect(ValidationUtil.isValidUrl('http://test.com/path')).toBe(true);
      expect(ValidationUtil.isValidUrl('https://sub.domain.com:8080/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(ValidationUtil.isValidUrl('not-a-url')).toBe(false);
      expect(ValidationUtil.isValidUrl('ftp://invalid')).toBe(true); // FTP is valid URL
      expect(ValidationUtil.isValidUrl('')).toBe(false);
    });
  });

  describe('isValidSlug', () => {
    it('should validate correct slugs', () => {
      expect(ValidationUtil.isValidSlug('valid-slug')).toBe(true);
      expect(ValidationUtil.isValidSlug('another-valid-slug-123')).toBe(true);
      expect(ValidationUtil.isValidSlug('simple')).toBe(true);
    });

    it('should reject invalid slugs', () => {
      expect(ValidationUtil.isValidSlug('Invalid Slug')).toBe(false);
      expect(ValidationUtil.isValidSlug('slug_with_underscore')).toBe(false);
      expect(ValidationUtil.isValidSlug('slug-')).toBe(false);
      expect(ValidationUtil.isValidSlug('-slug')).toBe(false);
      expect(ValidationUtil.isValidSlug('slug--double')).toBe(false);
    });
  });

  describe('generateSlug', () => {
    it('should generate slug from text', () => {
      expect(ValidationUtil.generateSlug('Hello World')).toBe('hello-world');
      expect(ValidationUtil.generateSlug('Test Product 123')).toBe('test-product-123');
      expect(ValidationUtil.generateSlug('Course: JavaScript Basics')).toBe('course-javascript-basics');
    });

    it('should handle special characters', () => {
      expect(ValidationUtil.generateSlug('Test & Product')).toBe('test-product');
      expect(ValidationUtil.generateSlug('Price: $99.99')).toBe('price-9999');
    });

    it('should handle multiple spaces', () => {
      expect(ValidationUtil.generateSlug('Multiple   Spaces')).toBe('multiple-spaces');
      expect(ValidationUtil.generateSlug('  Leading and Trailing  ')).toBe('leading-and-trailing');
    });
  });

  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      expect(ValidationUtil.sanitizeString('<p>Hello</p>')).toBe('Hello');
      expect(ValidationUtil.sanitizeString('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(ValidationUtil.sanitizeString('Normal <b>bold</b> text')).toBe('Normal bold text');
    });

    it('should trim whitespace', () => {
      expect(ValidationUtil.sanitizeString('  test  ')).toBe('test');
      expect(ValidationUtil.sanitizeString('\ntest\n')).toBe('test');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(ValidationUtil.isValidPhoneNumber('+1234567890')).toBe(true);
      expect(ValidationUtil.isValidPhoneNumber('1234567890')).toBe(true);
      expect(ValidationUtil.isValidPhoneNumber('+1 (234) 567-8900')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(ValidationUtil.isValidPhoneNumber('123')).toBe(false);
      expect(ValidationUtil.isValidPhoneNumber('abc')).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should validate values in range', () => {
      expect(ValidationUtil.isInRange(5, 0, 10)).toBe(true);
      expect(ValidationUtil.isInRange(0, 0, 10)).toBe(true);
      expect(ValidationUtil.isInRange(10, 0, 10)).toBe(true);
    });

    it('should reject values out of range', () => {
      expect(ValidationUtil.isInRange(-1, 0, 10)).toBe(false);
      expect(ValidationUtil.isInRange(11, 0, 10)).toBe(false);
    });
  });

  describe('isValidArrayLength', () => {
    it('should validate array length', () => {
      expect(ValidationUtil.isValidArrayLength([1, 2, 3], 1, 5)).toBe(true);
      expect(ValidationUtil.isValidArrayLength([1], 1)).toBe(true);
      expect(ValidationUtil.isValidArrayLength([], 0, 5)).toBe(true);
    });

    it('should reject invalid array length', () => {
      expect(ValidationUtil.isValidArrayLength([], 1)).toBe(false);
      expect(ValidationUtil.isValidArrayLength([1, 2, 3, 4, 5, 6], 1, 5)).toBe(false);
    });
  });

  describe('isValidUUID', () => {
    it('should validate correct UUIDs', () => {
      expect(ValidationUtil.isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(ValidationUtil.isValidUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(ValidationUtil.isValidUUID('not-a-uuid')).toBe(false);
      expect(ValidationUtil.isValidUUID('550e8400-e29b-41d4-a716')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(ValidationUtil.isAlphanumeric('abc123')).toBe(true);
      expect(ValidationUtil.isAlphanumeric('ABC')).toBe(true);
      expect(ValidationUtil.isAlphanumeric('123')).toBe(true);
    });

    it('should reject non-alphanumeric strings', () => {
      expect(ValidationUtil.isAlphanumeric('abc-123')).toBe(false);
      expect(ValidationUtil.isAlphanumeric('hello world')).toBe(false);
      expect(ValidationUtil.isAlphanumeric('test@123')).toBe(false);
    });
  });

  describe('hasValidExtension', () => {
    it('should validate file extensions', () => {
      expect(ValidationUtil.hasValidExtension('file.pdf', ['pdf', 'doc'])).toBe(true);
      expect(ValidationUtil.hasValidExtension('image.JPG', ['jpg', 'png'])).toBe(true);
    });

    it('should reject invalid extensions', () => {
      expect(ValidationUtil.hasValidExtension('file.exe', ['pdf', 'doc'])).toBe(false);
      expect(ValidationUtil.hasValidExtension('noextension', ['pdf'])).toBe(false);
    });
  });

  describe('isValidCreditCard', () => {
    it('should validate correct credit card numbers', () => {
      // Valid test card numbers (Luhn algorithm valid)
      expect(ValidationUtil.isValidCreditCard('4532015112830366')).toBe(true);
      expect(ValidationUtil.isValidCreditCard('6011514433546201')).toBe(true);
      expect(ValidationUtil.isValidCreditCard('4532-0151-1283-0366')).toBe(true);
    });

    it('should reject invalid credit card numbers', () => {
      expect(ValidationUtil.isValidCreditCard('1234567890123456')).toBe(false);
      expect(ValidationUtil.isValidCreditCard('abcd')).toBe(false);
      expect(ValidationUtil.isValidCreditCard('')).toBe(false);
    });
  });
});
