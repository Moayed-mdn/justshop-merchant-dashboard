'use client';

import { useQuery } from '@tanstack/react-query';
import { getSystemTemplates } from '@/lib/api/system-templates';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapSystemTemplate } from '@/lib/mappers/system-templates';
import type { SystemTemplate, SystemTemplateView } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useSystemTemplates(storeSlug: string, themeSlug: string) {
  return useQuery<SystemTemplate[], ApiError, SystemTemplateView[]>({
    queryKey: queryKeys.systemTemplates(storeSlug, themeSlug).list(),
    queryFn: () => getSystemTemplates(storeSlug, themeSlug),
    staleTime: QUERY_CONFIG.staleTime,
    select: (data) => data.map(mapSystemTemplate),
  });
}
