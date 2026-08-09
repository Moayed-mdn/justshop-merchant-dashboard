import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getNavigation } from '@/lib/api/runtime';
import { retryUnlessClientError } from '@/lib/query/retry';
import type { NavigationPayload } from '@/types/runtime';

export function useRuntimeNavigation() {
  return useQuery<NavigationPayload | null>({
    queryKey: queryKeys.storefront.runtime.navigation(),
    queryFn: async () => {
      const response = await getNavigation();
      if (response.error) throw new Error(response.error.message);
      return response.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
    retry: retryUnlessClientError,
  });
}
