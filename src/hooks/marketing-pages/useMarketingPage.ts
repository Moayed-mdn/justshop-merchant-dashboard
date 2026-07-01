'use client';

/**
 * Hook for fetching a single marketing page detail.
 */

import { useQuery } from '@tanstack/react-query';
import { getMarketingPageDetail } from '@/lib/api/marketing-pages';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapMarketingPageDetail } from '@/lib/mappers/marketing-pages';
import type { MarketingPageDetail, MarketingPageDetailView } from '@/types/marketing-page';
import type { ApiError } from '@/types/api';

export function useMarketingPage(storeSlug: string, pageId: string) {
  return useQuery<MarketingPageDetail, ApiError, MarketingPageDetailView>({
    queryKey: queryKeys.cmsPages(storeSlug).detail(pageId),
    queryFn:  () => getMarketingPageDetail(storeSlug, pageId),
    staleTime: QUERY_CONFIG.staleTime,
    select:    (page) => mapMarketingPageDetail(page, storeSlug),
    enabled:   Boolean(storeSlug && pageId),
  });
}
