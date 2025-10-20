/**
 * Base repository interface and implementation
 */

import { IQueryOptions, IPagination } from '@courses/shared';

export interface IBaseRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<T | null>;
  findAll(options?: IQueryOptions): Promise<T[]>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
  count(filters?: Record<string, unknown>): Promise<number>;
}

export abstract class BaseRepository<T, CreateDTO, UpdateDTO>
  implements IBaseRepository<T, CreateDTO, UpdateDTO>
{
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(options?: IQueryOptions): Promise<T[]>;
  abstract create(data: CreateDTO): Promise<T>;
  abstract update(id: string, data: UpdateDTO): Promise<T>;
  abstract delete(id: string): Promise<void>;
  abstract count(filters?: Record<string, unknown>): Promise<number>;

  /**
   * Calculate pagination metadata
   */
  protected calculatePagination(
    page: number,
    limit: number,
    total: number
  ): IPagination {
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Build pagination query parameters
   */
  protected buildPaginationQuery(options?: IQueryOptions) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    return { skip, take: limit, page, limit };
  }

  /**
   * Build sort query
   */
  protected buildSortQuery(options?: IQueryOptions) {
    if (!options?.sortBy) return undefined;

    return {
      [options.sortBy]: options.sortOrder || 'asc',
    };
  }
}
