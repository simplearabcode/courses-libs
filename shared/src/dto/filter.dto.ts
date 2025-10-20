/**
 * Common filter DTOs
 */

export interface IDateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface IPriceRangeFilter {
  minPrice?: number;
  maxPrice?: number;
}

export interface ISearchFilter {
  search?: string;
  searchFields?: string[];
}

export interface ICourseFilter extends ISearchFilter, IPriceRangeFilter {
  categoryId?: string;
  instructorId?: string;
  level?: string;
  status?: string;
  visibility?: string;
  isFeatured?: boolean;
  tags?: string[];
}

export interface IEnrollmentFilter extends IDateRangeFilter {
  studentId?: string;
  courseId?: string;
  status?: string;
}

export class BaseFilter {
  filters: Record<string, unknown>;

  constructor(filters: Record<string, unknown> = {}) {
    this.filters = this.sanitizeFilters(filters);
  }

  private sanitizeFilters(filters: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  isEmpty(): boolean {
    return Object.keys(this.filters).length === 0;
  }

  toObject(): Record<string, unknown> {
    return { ...this.filters };
  }
}
