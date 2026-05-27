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

export function useMarketingPage(storeId: string, pageId: string) {
  return useQuery<MarketingPageDetail, ApiError, MarketingPageDetailView>({
    queryKey: queryKeys.cmsPages(storeId).detail(pageId),
    queryFn:  () => getMarketingPageDetail(storeId, pageId),
    staleTime: QUERY_CONFIG.staleTime,
    select:    mapMarketingPageDetail,
    enabled:   Boolean(storeId && pageId),
  });
}
