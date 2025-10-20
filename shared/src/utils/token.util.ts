/**
 * Token generation utility
 */

import { randomBytes } from 'crypto';

export class TokenUtil {
  /**
   * Generate a random token
   */
  static generate(length = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Generate a verification token
   */
  static generateVerificationToken(): string {
    return this.generate(32);
  }

  /**
   * Generate a password reset token
   */
  static generatePasswordResetToken(): string {
    return this.generate(32);
  }

  /**
   * Generate a session ID
   */
  static generateSessionId(): string {
    return this.generate(16);
  }
}
