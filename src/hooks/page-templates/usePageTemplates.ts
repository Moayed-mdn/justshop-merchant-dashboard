'use client';

import { useQuery } from '@tanstack/react-query';
import { getPageTemplates } from '@/lib/api/page-templates';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapPageTemplate } from '@/lib/mappers/page-templates';
import type { PageTemplate, PageTemplateView } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function usePageTemplates(storeId: string) {
  return useQuery<PageTemplate[], ApiError, PageTemplateView[]>({
    queryKey: queryKeys.pageTemplates(storeId).list(),
    queryFn: () => getPageTemplates(storeId),
    staleTime: QUERY_CONFIG.staleTime,
    select: (data) => data.map(mapPageTemplate),
  });
}
