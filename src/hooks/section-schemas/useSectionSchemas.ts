'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getSectionSchemas } from '@/lib/api/section-schemas';

export function useSectionSchemas(storeSlug: string) {
  return useQuery({
    queryKey: queryKeys.sectionSchemas(storeSlug).all(),
    queryFn: () => getSectionSchemas(storeSlug),
    enabled: !!storeSlug,
  });
}
