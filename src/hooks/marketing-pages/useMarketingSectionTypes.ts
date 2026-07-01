'use client';

/**
 * Hook for fetching available marketing section types.
 */

import { useQuery } from '@tanstack/react-query';
import { getMarketingSectionTypes } from '@/lib/api/marketing-pages';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { SectionTypeOption } from '@/types/marketing-page';
import type { ApiError } from '@/types/api';

export function useMarketingSectionTypes(storeSlug: string) {
  return useQuery<SectionTypeOption[], ApiError>({
    queryKey: queryKeys.marketingSectionTypes(storeSlug).all(),
    queryFn:  () => getMarketingSectionTypes(storeSlug),
    staleTime: QUERY_CONFIG.staleTime,
  });
}
