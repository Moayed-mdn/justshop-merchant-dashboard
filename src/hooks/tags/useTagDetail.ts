'use client';

import { useQuery } from '@tanstack/react-query';
import { getTagDetail } from '@/lib/api/tags';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapTagDetail } from '@/lib/mappers/tags';
import { useLocale } from 'next-intl';
import type { TagRaw, TagDetailView } from '@/types/tag';
import type { ApiError } from '@/types/api';

export function useTagDetail(storeSlug: string, tagId: string) {
  const locale = useLocale();

  return useQuery<TagRaw, ApiError, TagDetailView>({
    queryKey:  queryKeys.tags(storeSlug).detail(tagId),
    queryFn:   () => getTagDetail(storeSlug, tagId),
    staleTime: QUERY_CONFIG.staleTime,
    select:    mapTagDetail(locale, storeSlug),
    enabled:   Boolean(storeSlug) && Boolean(tagId),
  });
}