'use client';

import { useQuery } from '@tanstack/react-query';
import { getBlockInstances } from '@/lib/api/block-instances';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { ThemeBlockInstance } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useBlockInstances(storeSlug: string, themeIdentifier: string, sectionId: string) {
  return useQuery<ThemeBlockInstance[], ApiError>({
    queryKey: queryKeys.blockInstances(storeSlug, themeIdentifier, sectionId).list(),
    queryFn: () => getBlockInstances(storeSlug, themeIdentifier, sectionId),
    staleTime: QUERY_CONFIG.staleTime,
    enabled: !!storeSlug && !!themeIdentifier && !!sectionId,
  });
}
