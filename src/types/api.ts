/**
 * Base API types used across the entire application.
 *
 * The dashboard auth/bootstrap contract is canonical and uses `success`.
 * Some older surfaces still expose `status`, so the shared types stay
 * backward-compatible while new code should prefer `success`.
 */

export interface ApiResponse<T, TMeta = Record<string, never>> {
  success?: boolean;
  status?: boolean;
  data: T;
  message: string;
  meta?: TMeta;
}

export interface PaginatedResponse<T> {
  success?: boolean;
  status?: boolean;
  message: string;
  data: T[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface PaginationMeta {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  from?: number;
  to?: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface ApiError {
  message: string;
  errors: Record<string, string[]>;
  status: number;
  code: string;
  redirect?: string;
  logoutUrl?: string;
  action?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
