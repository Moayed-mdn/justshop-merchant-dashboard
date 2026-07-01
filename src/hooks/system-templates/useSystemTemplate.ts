'use client';

import { useQuery } from '@tanstack/react-query';
import { getSystemTemplateDetail } from '@/lib/api/system-templates';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapSystemTemplate } from '@/lib/mappers/system-templates';
import type { SystemTemplate, SystemTemplateView } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useSystemTemplate(storeSlug: string, themeSlug: string, templateId: string) {
  return useQuery<SystemTemplate, ApiError, SystemTemplateView>({
    queryKey: queryKeys.systemTemplates(storeSlug, themeSlug).detail(templateId),
    queryFn: () => getSystemTemplateDetail(storeSlug, themeSlug, templateId),
    staleTime: QUERY_CONFIG.staleTime,
    select: mapSystemTemplate,
  });
}
