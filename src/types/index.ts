/**
 * Global TypeScript types
 */

export type PeriodType = 'all' | '1m' | '3m' | '6m' | '1y' | 'ytd';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  count: number;
  page?: number;
  total?: number;
}
