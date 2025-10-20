/**
 * Standardized API response types
 */

export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: IErrorDetails;
}

export interface IErrorDetails {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: IPagination;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}
