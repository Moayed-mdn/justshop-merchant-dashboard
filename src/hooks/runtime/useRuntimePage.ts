import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getPage } from '@/lib/api/runtime';
import type { RuntimePagePayload } from '@/types/runtime';

export function useRuntimePage(pageId: string | null, preview?: boolean) {
  return useQuery<RuntimePagePayload | null>({
    queryKey: queryKeys.storefront.runtime.page(pageId ?? ''),
    queryFn: async () => {
      if (!pageId) return null;
      const response = await getPage(pageId, { preview });
      if (response.error) throw new Error(response.error.message);
      return response.data?.page ?? null;
    },
    enabled: !!pageId,
  });
}
