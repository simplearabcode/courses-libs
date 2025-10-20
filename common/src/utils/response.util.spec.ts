/**
 * Response Utility Tests
 */

import {
  successResponse,
  paginatedResponse,
  errorResponse,
  createdResponse,
  noContentResponse,
} from './response.util';
import { IPagination } from '@courses/shared';

describe('ResponseUtil', () => {
  describe('successResponse', () => {
    it('should create a success response with data', () => {
      const data = { id: '123', name: 'Test User' };
      const response = successResponse(data, 'User retrieved successfully');

      expect(response).toEqual({
        success: true,
        message: 'User retrieved successfully',
        data,
      });
    });

    it('should use default message', () => {
      const data = { id: '123' };
      const response = successResponse(data);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Success');
      expect(response.data).toEqual(data);
    });

    it('should handle null data', () => {
      const response = successResponse(null);

      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
    });

    it('should handle array data', () => {
      const data = [1, 2, 3];
      const response = successResponse(data);

      expect(response.success).toBe(true);
      expect(response.data).toEqual([1, 2, 3]);
    });
  });

  describe('paginatedResponse', () => {
    it('should create a paginated response', () => {
      const data = [
        { id: '1', name: 'Course 1' },
        { id: '2', name: 'Course 2' },
      ];
      const pagination: IPagination = {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      const response = paginatedResponse(data, pagination);

      expect(response).toEqual({
        success: true,
        data,
        pagination,
      });
    });

    it('should handle empty data array', () => {
      const pagination: IPagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };

      const response = paginatedResponse([], pagination);

      expect(response.success).toBe(true);
      expect(response.data).toEqual([]);
      expect(response.pagination.total).toBe(0);
    });

    it('should include pagination metadata', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({ id: `${i + 1}` }));
      const pagination: IPagination = {
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      };

      const response = paginatedResponse(data, pagination);

      expect(response.pagination.page).toBe(2);
      expect(response.pagination.hasNext).toBe(true);
      expect(response.pagination.hasPrev).toBe(true);
    });
  });

  describe('errorResponse', () => {
    it('should create an error response', () => {
      const response = errorResponse('VAL_2001', 'Validation failed', {
        field: 'email',
      });

      expect(response).toEqual({
        success: false,
        message: 'Validation failed',
        error: {
          code: 'VAL_2001',
          message: 'Validation failed',
          details: { field: 'email' },
        },
      });
    });

    it('should create an error response without details', () => {
      const response = errorResponse('AUTH_1001', 'Unauthorized');

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe('AUTH_1001');
      expect(response.error?.message).toBe('Unauthorized');
      expect(response.error?.details).toBeUndefined();
    });

    it('should handle complex error details', () => {
      const details = {
        errors: [
          { field: 'email', message: 'Invalid format' },
          { field: 'password', message: 'Too weak' },
        ],
      };

      const response = errorResponse('VAL_2001', 'Validation failed', details);

      expect(response.error?.details).toEqual(details);
    });
  });

  describe('createdResponse', () => {
    it('should create a created response with default message', () => {
      const data = { id: '123', name: 'New Course' };
      const response = createdResponse(data);

      expect(response).toEqual({
        success: true,
        message: 'Resource created successfully',
        data,
      });
    });

    it('should create a created response with custom message', () => {
      const data = { id: '123' };
      const response = createdResponse(data, 'User created successfully');

      expect(response.success).toBe(true);
      expect(response.message).toBe('User created successfully');
      expect(response.data).toEqual(data);
    });

    it('should handle complex created data', () => {
      const data = {
        id: '123',
        title: 'JavaScript Basics',
        instructor: { id: '456', name: 'John Doe' },
      };

      const response = createdResponse(data, 'Course created');

      expect(response.data).toEqual(data);
      if (response.data) {
        expect(response.data.instructor).toBeDefined();
      }
    });
  });

  describe('noContentResponse', () => {
    it('should create a no content response with default message', () => {
      const response = noContentResponse();

      expect(response).toEqual({
        success: true,
        message: 'Operation completed successfully',
        data: null,
      });
    });

    it('should create a no content response with custom message', () => {
      const response = noContentResponse('Resource deleted successfully');

      expect(response.success).toBe(true);
      expect(response.message).toBe('Resource deleted successfully');
      expect(response.data).toBeNull();
    });
  });

  describe('response consistency', () => {
    it('should maintain consistent success response structure', () => {
      const responses = [
        successResponse({ test: true }),
        createdResponse({ test: true }),
        noContentResponse(),
      ];

      responses.forEach((response) => {
        expect(response).toHaveProperty('success', true);
        expect(response).toHaveProperty('message');
        expect(response).toHaveProperty('data');
      });
    });

    it('should maintain consistent error response structure', () => {
      const response = errorResponse('TEST_001', 'Test error');

      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('error');
      expect(response.error).toHaveProperty('code');
      expect(response.error).toHaveProperty('message');
    });
  });
});
