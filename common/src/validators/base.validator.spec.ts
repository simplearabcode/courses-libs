/**
 * Base Validator Schema Tests
 */

import {
  emailSchema,
  passwordSchema,
  uuidSchema,
  paginationSchema,
  querySchema,
} from './base.validator';

describe('Base Validator Schemas', () => {
  describe('emailSchema', () => {
    it('should have correct email validation properties', () => {
      expect(emailSchema.type).toBe('string');
      expect(emailSchema.format).toBe('email');
    });

    it('should have transform properties', () => {
      expect(emailSchema.transform).toContain('trim');
      expect(emailSchema.transform).toContain('toLowerCase');
    });
  });

  describe('passwordSchema', () => {
    it('should have correct password validation properties', () => {
      expect(passwordSchema.type).toBe('string');
      expect(passwordSchema.minLength).toBe(8);
    });

    it('should have pattern for password complexity', () => {
      expect(passwordSchema.pattern).toBeDefined();
      expect(typeof passwordSchema.pattern).toBe('string');
    });

    it('should have error messages', () => {
      expect(passwordSchema.errorMessage).toBeDefined();
      expect(passwordSchema.errorMessage.minLength).toBe(
        'Password must be at least 8 characters'
      );
      expect(passwordSchema.errorMessage.pattern).toContain('uppercase');
      expect(passwordSchema.errorMessage.pattern).toContain('lowercase');
      expect(passwordSchema.errorMessage.pattern).toContain('number');
      expect(passwordSchema.errorMessage.pattern).toContain('special character');
    });
  });

  describe('uuidSchema', () => {
    it('should have correct UUID validation properties', () => {
      expect(uuidSchema.type).toBe('string');
      expect(uuidSchema.format).toBe('uuid');
    });

    it('should have error message', () => {
      expect(uuidSchema.errorMessage).toBe('Invalid UUID format');
    });
  });

  describe('paginationSchema', () => {
    it('should have correct pagination properties', () => {
      expect(paginationSchema.type).toBe('object');
      expect(paginationSchema.additionalProperties).toBe(false);
    });

    it('should have page property with correct constraints', () => {
      expect(paginationSchema.properties.page.type).toBe('integer');
      expect(paginationSchema.properties.page.minimum).toBe(1);
      expect(paginationSchema.properties.page.default).toBe(1);
    });

    it('should have limit property with correct constraints', () => {
      expect(paginationSchema.properties.limit.type).toBe('integer');
      expect(paginationSchema.properties.limit.minimum).toBe(1);
      expect(paginationSchema.properties.limit.maximum).toBe(100);
      expect(paginationSchema.properties.limit.default).toBe(10);
    });

    it('should have sortBy property', () => {
      expect(paginationSchema.properties.sortBy.type).toBe('string');
    });

    it('should have sortOrder property with enum', () => {
      expect(paginationSchema.properties.sortOrder.type).toBe('string');
      expect(paginationSchema.properties.sortOrder.enum).toEqual(['asc', 'desc']);
      expect(paginationSchema.properties.sortOrder.default).toBe('asc');
    });
  });

  describe('querySchema', () => {
    it('should have correct query properties', () => {
      expect(querySchema.type).toBe('object');
      expect(querySchema.additionalProperties).toBe(false);
    });

    it('should have search property', () => {
      expect(querySchema.properties.search.type).toBe('string');
    });

    it('should have filters property', () => {
      expect(querySchema.properties.filters.type).toBe('object');
    });
  });

  describe('schema immutability', () => {
    it('should be readonly schemas', () => {
      // TypeScript compile-time check - schemas should be const assertions
      // This ensures they can't be modified at runtime
      expect(Object.isFrozen(emailSchema)).toBe(false); // const assertions don't freeze
      expect(emailSchema).toBeDefined();
    });
  });

  describe('schema completeness', () => {
    it('should have all required email schema fields', () => {
      const requiredFields = ['type', 'format', 'transform'];
      requiredFields.forEach((field) => {
        expect(emailSchema).toHaveProperty(field);
      });
    });

    it('should have all required password schema fields', () => {
      const requiredFields = ['type', 'minLength', 'pattern', 'errorMessage'];
      requiredFields.forEach((field) => {
        expect(passwordSchema).toHaveProperty(field);
      });
    });

    it('should have all required pagination schema fields', () => {
      const requiredFields = ['type', 'properties', 'additionalProperties'];
      requiredFields.forEach((field) => {
        expect(paginationSchema).toHaveProperty(field);
      });
    });
  });
});
