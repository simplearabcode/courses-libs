/**
 * Password Utility Tests
 */

import { PasswordUtil } from './password.util';

describe('PasswordUtil', () => {
  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123!';
      const hashed = await PasswordUtil.hash(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await PasswordUtil.hash(password);
      const hash2 = await PasswordUtil.hash(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = 'TestPassword123!';
      const hashed = await PasswordUtil.hash(password);
      const result = await PasswordUtil.compare(password, hashed);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword456!';
      const hashed = await PasswordUtil.hash(password);
      const result = await PasswordUtil.compare(wrongPassword, hashed);

      expect(result).toBe(false);
    });
  });

  describe('validateStrength', () => {
    it('should validate a strong password', () => {
      const result = PasswordUtil.validateStrength('StrongPass123!');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = PasswordUtil.validateStrength('Short1!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase letter', () => {
      const result = PasswordUtil.validateStrength('lowercase123!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = PasswordUtil.validateStrength('UPPERCASE123!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = PasswordUtil.validateStrength('NoNumberPass!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = PasswordUtil.validateStrength('NoSpecial123');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should return multiple errors for weak password', () => {
      const result = PasswordUtil.validateStrength('weak');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
