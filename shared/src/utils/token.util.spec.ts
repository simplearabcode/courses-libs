/**
 * Token Utility Tests
 */

import { TokenUtil } from './token.util';

describe('TokenUtil', () => {
  describe('generate', () => {
    it('should generate a token with default length', () => {
      const token = TokenUtil.generate();

      expect(token).toBeDefined();
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should generate a token with custom length', () => {
      const token = TokenUtil.generate(16);

      expect(token).toBeDefined();
      expect(token.length).toBe(32); // 16 bytes = 32 hex chars
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const token1 = TokenUtil.generate();
      const token2 = TokenUtil.generate();

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateVerificationToken', () => {
    it('should generate a verification token', () => {
      const token = TokenUtil.generateVerificationToken();

      expect(token).toBeDefined();
      expect(token.length).toBe(64);
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should generate unique verification tokens', () => {
      const token1 = TokenUtil.generateVerificationToken();
      const token2 = TokenUtil.generateVerificationToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should generate a password reset token', () => {
      const token = TokenUtil.generatePasswordResetToken();

      expect(token).toBeDefined();
      expect(token.length).toBe(64);
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should generate unique password reset tokens', () => {
      const token1 = TokenUtil.generatePasswordResetToken();
      const token2 = TokenUtil.generatePasswordResetToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateSessionId', () => {
    it('should generate a session ID', () => {
      const sessionId = TokenUtil.generateSessionId();

      expect(sessionId).toBeDefined();
      expect(sessionId.length).toBe(32); // 16 bytes = 32 hex chars
      expect(/^[a-f0-9]+$/.test(sessionId)).toBe(true);
    });

    it('should generate unique session IDs', () => {
      const sessionId1 = TokenUtil.generateSessionId();
      const sessionId2 = TokenUtil.generateSessionId();

      expect(sessionId1).not.toBe(sessionId2);
    });
  });
});
