import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getTheme } from '@/lib/api/runtime';
import type { RuntimeThemePayload } from '@/types/runtime';

export function useRuntimeTheme() {
  return useQuery<RuntimeThemePayload | null>({
    queryKey: queryKeys.storefront.runtime.theme(),
    queryFn: async () => {
      const response = await getTheme();
      if (response.error) throw new Error(response.error.message);
      return response.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}
