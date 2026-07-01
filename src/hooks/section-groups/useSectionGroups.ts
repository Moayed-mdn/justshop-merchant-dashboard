'use client';

import { useQuery } from '@tanstack/react-query';
import { getSectionGroups } from '@/lib/api/section-groups';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { ThemeSectionGroup } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useSectionGroups(storeSlug: string, themeIdentifier: string) {
  return useQuery<ThemeSectionGroup[], ApiError>({
    queryKey: queryKeys.sectionGroups(storeSlug, themeIdentifier).list(),
    queryFn: () => getSectionGroups(storeSlug, themeIdentifier),
    staleTime: QUERY_CONFIG.staleTime,
    enabled: !!storeSlug && !!themeIdentifier,
  });
}
