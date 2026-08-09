import { ApiErrorClass } from '@/lib/api/core/transport';
import { QUERY_CONFIG } from '@/config/query';

/**
 * Default React Query retry policy, but skip 4xx client errors (not transient).
 */
export function retryUnlessClientError(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiErrorClass && error.status >= 400 && error.status < 500) {
    return false;
  }
  return failureCount < QUERY_CONFIG.retry;
}
