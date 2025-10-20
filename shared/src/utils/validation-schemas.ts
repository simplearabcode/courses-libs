/**
 * JSON Schema definitions for common validation patterns (AJV)
 */

export const emailSchema = {
  type: 'string',
  format: 'email',
  minLength: 5,
  maxLength: 255,
  errorMessage: {
    format: 'Must be a valid email address',
    minLength: 'Email must be at least 5 characters',
    maxLength: 'Email must not exceed 255 characters',
  },
} as const;

export const passwordSchema = {
  type: 'string',
  minLength: 8,
  maxLength: 128,
  pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
  errorMessage: {
    minLength: 'Password must be at least 8 characters',
    maxLength: 'Password must not exceed 128 characters',
    pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  },
} as const;

export const uuidSchema = {
  type: 'string',
  format: 'uuid',
  errorMessage: {
    format: 'Must be a valid UUID',
  },
} as const;

export const urlSchema = {
  type: 'string',
  format: 'uri',
  errorMessage: {
    format: 'Must be a valid URL',
  },
} as const;

export const slugSchema = {
  type: 'string',
  pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  minLength: 1,
  maxLength: 100,
  errorMessage: {
    pattern: 'Slug must contain only lowercase letters, numbers, and hyphens',
    minLength: 'Slug must be at least 1 character',
    maxLength: 'Slug must not exceed 100 characters',
  },
} as const;

export const phoneSchema = {
  type: 'string',
  pattern: '^\\+?[\\d\\s\\-()]{10,}$',
  errorMessage: {
    pattern: 'Must be a valid phone number',
  },
} as const;
