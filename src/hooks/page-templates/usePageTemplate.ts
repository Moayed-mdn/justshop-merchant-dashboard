'use client';

import { useQuery } from '@tanstack/react-query';
import { getPageTemplateDetail } from '@/lib/api/page-templates';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapPageTemplate } from '@/lib/mappers/page-templates';
import type { PageTemplate, PageTemplateView } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function usePageTemplate(storeSlug: string, templateId: string) {
  return useQuery<PageTemplate, ApiError, PageTemplateView>({
    queryKey: queryKeys.pageTemplates(storeSlug).detail(templateId),
    queryFn: () => getPageTemplateDetail(storeSlug, templateId),
    staleTime: QUERY_CONFIG.staleTime,
    select: (template) => mapPageTemplate(template, storeSlug),
  });
}
