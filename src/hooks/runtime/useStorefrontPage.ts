import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { resolveRoute, getPage } from '@/lib/api/runtime';
import { retryUnlessClientError } from '@/lib/query/retry';
import type { RuntimePagePayload } from '@/types/runtime';
import { useLocale } from 'next-intl';

export function useStorefrontPage(path: string, preview?: boolean) {
  const locale = useLocale();

  return useQuery<RuntimePagePayload | null>({
    queryKey: [...queryKeys.storefront.runtime.resolve(path), locale] as const,
    queryFn: async () => {
      const resolution = await resolveRoute({ path, locale, preview });
      if (resolution.error) throw new Error(resolution.error.message);
      if (!resolution.data || resolution.data.status !== 'matched' || !resolution.data.pageId) {
        throw new Error('Route not found');
      }
      const pageResponse = await getPage(resolution.data.pageId, { preview });
      if (pageResponse.error) throw new Error(pageResponse.error.message);
      return pageResponse.data?.page ?? null;
    },
    retry: retryUnlessClientError,
  });
}
