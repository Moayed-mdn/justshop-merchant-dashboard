'use client';

import { useQuery } from '@tanstack/react-query';
import { getBlocks } from '@/lib/api/blocks';
import { QUERY_CONFIG } from '@/config/query';
import type { ThemeBlock } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useBlocks(storeSlug: string, themeIdentifier: string, sectionId: string) {
  return useQuery<ThemeBlock[], ApiError>({
    queryKey: ['merchant', storeSlug, 'blocks', themeIdentifier, sectionId, 'list'],
    queryFn: () => getBlocks(storeSlug, themeIdentifier, sectionId),
    staleTime: QUERY_CONFIG.staleTime,
    enabled: !!storeSlug && !!themeIdentifier && !!sectionId,
  });
}
