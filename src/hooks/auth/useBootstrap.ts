'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import type { ApiError } from '@/types/api';

export function useBootstrap() {
  const fetchBootstrap = useBootstrapStore((state) => state.fetchBootstrap);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: ({ signal }) => fetchBootstrap({ signal }),
    staleTime: 0,
    gcTime: 1000 * 60,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError;
      if (apiError.status === 401) {
        return false;
      }

      return failureCount < 1;
    },
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
  };

  return {
    ...query,
    invalidate,
  };
}
