'use client';

/**
 * Hook for fetching paginated marketing pages list.
 */

import { useQuery } from '@tanstack/react-query';
import { getMarketingPages } from '@/lib/api/marketing-pages';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapMarketingPageListItem } from '@/lib/mappers/marketing-pages';
import { selectPaginatedList } from '@/lib/mappers/pagination';
import type { MarketingPageListItem, MarketingPageListItemView } from '@/types/marketing-page';
import type { PaginatedResponse, ApiError } from '@/types/api';
import type { MarketingPageFilters } from '@/schemas/marketing-pages';

const DEFAULT_FILTERS: MarketingPageFilters = {
  search:   '',
  status:   'all',
  template: 'all',
  page:     1,
  perPage:  15,
};

export function useMarketingPages(
  storeId: string,
  filters: MarketingPageFilters = DEFAULT_FILTERS,
) {
  return useQuery<
    PaginatedResponse<MarketingPageListItem>,
    ApiError,
    PaginatedResponse<MarketingPageListItemView>
  >({
    queryKey: queryKeys.cmsPages(storeId).list(
      filters as unknown as Record<string, unknown>,
    ),
    queryFn:   () => getMarketingPages(storeId, filters),
    staleTime: QUERY_CONFIG.staleTime,
    select:    selectPaginatedList(mapMarketingPageListItem),
  });
}
