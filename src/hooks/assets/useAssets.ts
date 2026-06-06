'use client';

/**
 * Hook for fetching paginated assets list.
 */

import { useQuery } from '@tanstack/react-query';
import { getAssets } from '@/lib/api/assets';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapStoreAsset } from '@/lib/mappers/assets';
import { selectPaginatedList } from '@/lib/mappers/pagination';
import type {
  StoreAsset,
  StoreAssetView,
  AssetFilters,
} from '@/types/asset';
import type { PaginatedResponse, ApiError } from '@/types/api';

const DEFAULT_FILTERS: AssetFilters = {
  page: 1,
  perPage: 24, // Grid layout works better with multiples of 6
};

export function useAssets(
  storeId: string,
  filters: AssetFilters = DEFAULT_FILTERS,
) {
  return useQuery<
    PaginatedResponse<StoreAsset>,
    ApiError,
    PaginatedResponse<StoreAssetView>
  >({
    queryKey: queryKeys.assets(storeId).list(
      filters as unknown as Record<string, unknown>,
    ),
    queryFn: () => getAssets(storeId, filters),
    staleTime: QUERY_CONFIG.staleTime,
    select: selectPaginatedList(mapStoreAsset),
  });
}
