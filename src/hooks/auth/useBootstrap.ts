'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import type { ApiError } from '@/types/api';

export function useBootstrap(enabled: boolean = true) {
  const fetchBootstrap = useBootstrapStore((state) => state.fetchBootstrap);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.merchant.me(),
    queryFn: ({ signal }) => fetchBootstrap({ signal }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError;

      // Don't retry on 401 or domain mismatch — these are not transient errors
      if (apiError.status === 401) {
        queryClient.setQueryData(queryKeys.merchant.me(), null);
        return false;
      }

      if (apiError.code === 'IDENTITY_DOMAIN_MISMATCH' || apiError.action === 'logout_required') {
        return false;
      }

      return failureCount < 1;
    },
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.merchant.me() });
  };

  return {
    ...query,
    invalidate,
  };
}
