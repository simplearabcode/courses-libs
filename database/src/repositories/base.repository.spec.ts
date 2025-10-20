/**
 * Tests for base repository
 */

import { BaseRepository } from './base.repository';
import { IQueryOptions } from '@courses/shared';

class TestRepository extends BaseRepository<any, any, any> {
  async findById(id: string) {
    return { id };
  }
  async findAll(_options?: IQueryOptions) {
    return [];
  }
  async create(data: any) {
    return data;
  }
  async update(id: string, data: any) {
    return { id, ...data };
  }
  async delete(_id: string) {
    return;
  }
  async count(_filters?: Record<string, unknown>) {
    return 0;
  }
}

describe('BaseRepository', () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
  });

  describe('calculatePagination', () => {
    it('should calculate pagination correctly', () => {
      const result = repository['calculatePagination'](1, 10, 100);

      expect(result).toEqual({
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNext: true,
        hasPrev: false,
      });
    });

    it('should handle last page', () => {
      const result = repository['calculatePagination'](10, 10, 100);

      expect(result).toEqual({
        page: 10,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNext: false,
        hasPrev: true,
      });
    });
  });

  describe('buildPaginationQuery', () => {
    it('should build pagination query with defaults', () => {
      const result = repository['buildPaginationQuery']();

      expect(result).toEqual({
        skip: 0,
        take: 10,
        page: 1,
        limit: 10,
      });
    });

    it('should build pagination query with custom values', () => {
      const result = repository['buildPaginationQuery']({
        page: 3,
        limit: 20,
      });

      expect(result).toEqual({
        skip: 40,
        take: 20,
        page: 3,
        limit: 20,
      });
    });
  });

  describe('buildSortQuery', () => {
    it('should return undefined if no sortBy', () => {
      const result = repository['buildSortQuery']();

      expect(result).toBeUndefined();
    });

    it('should build sort query', () => {
      const result = repository['buildSortQuery']({
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result).toEqual({
        createdAt: 'desc',
      });
    });
  });
});
