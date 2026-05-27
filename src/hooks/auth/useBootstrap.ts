'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import type { ApiError } from '@/types/api';

export function useBootstrap() {
  const fetchBootstrap = useBootstrapStore((state) => state.fetchBootstrap);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.merchant.me(),
    queryFn: ({ signal }) => fetchBootstrap({ signal }),
    staleTime: 0,
    gcTime: 1000 * 60,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError;
      const message = apiError.message?.toLowerCase() ?? '';
      const isContaminated = message.includes('session contamination') || message.includes('domain mismatch');

      if (apiError.status === 401 || isContaminated) {
        queryClient.setQueryData(queryKeys.merchant.me(), null);
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
