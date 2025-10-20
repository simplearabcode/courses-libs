/**
 * Base validation schemas using JSON Schema (AJV)
 */

// Email validation schema
export const emailSchema = {
  type: 'string',
  format: 'email',
  transform: ['trim', 'toLowerCase'],
} as const;

// Password validation schema
export const passwordSchema = {
  type: 'string',
  minLength: 8,
  pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$',
  errorMessage: {
    minLength: 'Password must be at least 8 characters',
    pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  },
} as const;

// UUID validation schema
export const uuidSchema = {
  type: 'string',
  format: 'uuid',
  errorMessage: 'Invalid UUID format',
} as const;

// Pagination validation schema
export const paginationSchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    sortBy: { type: 'string' },
    sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
  },
  additionalProperties: false,
} as const;

// Query params validation schema
export const querySchema = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    filters: { type: 'object' },
  },
  additionalProperties: false,
} as const;
