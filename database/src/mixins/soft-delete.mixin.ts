/**
 * Soft delete mixin for repositories
 */

import { BaseRepository, IBaseRepository } from '../repositories/base.repository';
import { IQueryOptions } from '@courses/shared';

export interface ISoftDeletable {
  deletedAt?: Date | null;
}

export interface ISoftDeleteRepository<T extends ISoftDeletable, CreateDTO, UpdateDTO>
  extends IBaseRepository<T, CreateDTO, UpdateDTO> {
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  findAllIncludingDeleted(options?: IQueryOptions): Promise<T[]>;
  findByIdIncludingDeleted(id: string): Promise<T | null>;
  permanentDelete(id: string): Promise<void>;
}

/**
 * Abstract base repository with soft delete support
 * 
 * @example
 * ```typescript
 * class UserRepository extends SoftDeleteRepository<User, CreateUserDTO, UpdateUserDTO> {
 *   constructor(private prisma: PrismaClient) {
 *     super();
 *   }
 * 
 *   async findById(id: string): Promise<User | null> {
 *     return this.prisma.user.findFirst({
 *       where: { id, deletedAt: null },
 *     });
 *   }
 * 
 *   // Implement other abstract methods...
 * }
 * 
 * // Usage
 * await userRepo.softDelete(userId); // Sets deletedAt
 * await userRepo.restore(userId);     // Clears deletedAt
 * await userRepo.delete(userId);      // Permanent delete
 * ```
 */
export abstract class SoftDeleteRepository<
  T extends ISoftDeletable,
  CreateDTO,
  UpdateDTO
> extends BaseRepository<T, CreateDTO, UpdateDTO>
  implements ISoftDeleteRepository<T, CreateDTO, UpdateDTO> {
  
  /**
   * Soft delete a record (set deletedAt timestamp)
   */
  async softDelete(id: string): Promise<void> {
    await this.update(id, { deletedAt: new Date() } as UpdateDTO);
  }

  /**
   * Restore a soft-deleted record (clear deletedAt)
   */
  async restore(id: string): Promise<void> {
    const record = await this.findByIdIncludingDeleted(id);
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    await this.update(id, { deletedAt: null } as UpdateDTO);
  }

  /**
   * Check if a record is soft-deleted
   */
  async isSoftDeleted(id: string): Promise<boolean> {
    const record = await this.findByIdIncludingDeleted(id);
    return record ? !!record.deletedAt : false;
  }

  /**
   * Get count of soft-deleted records
   */
  async countDeleted(filters?: Record<string, unknown>): Promise<number> {
    return await this.countWithFilters({
      ...filters,
      deletedAt: { not: null },
    });
  }

  /**
   * Get count of active (not deleted) records
   */
  async countActive(filters?: Record<string, unknown>): Promise<number> {
    return await this.count({
      ...filters,
      deletedAt: null,
    });
  }

  /**
   * Find all records including soft-deleted ones
   */
  abstract findAllIncludingDeleted(options?: IQueryOptions): Promise<T[]>;

  /**
   * Find by ID including soft-deleted records
   */
  abstract findByIdIncludingDeleted(id: string): Promise<T | null>;

  /**
   * Permanently delete a record (cannot be restored)
   */
  abstract permanentDelete(id: string): Promise<void>;

  /**
   * Helper to count with additional filters
   */
  protected abstract countWithFilters(filters: Record<string, unknown>): Promise<number>;

  /**
   * Override the default delete to use soft delete
   * To permanently delete, use permanentDelete()
   */
  async delete(id: string): Promise<void> {
    await this.softDelete(id);
  }
}

/**
 * Soft delete filter helper
 */
export function excludeDeleted<T extends Record<string, unknown>>(
  where: T = {} as T
): T & { deletedAt: null } {
  return {
    ...where,
    deletedAt: null,
  };
}

/**
 * Include deleted filter helper
 */
export function includeDeleted<T extends Record<string, unknown>>(
  where: T = {} as T
): T {
  return where;
}

/**
 * Only deleted filter helper
 */
export function onlyDeleted<T extends Record<string, unknown>>(
  where: T = {} as T
): T & { deletedAt: { not: null } } {
  return {
    ...where,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deletedAt: { not: null } as any,
  };
}
