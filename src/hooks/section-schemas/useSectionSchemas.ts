'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getSectionSchemas } from '@/lib/api/section-schemas';

export function useSectionSchemas(storeId: string) {
  return useQuery({
    queryKey: queryKeys.sectionSchemas(storeId).all(),
    queryFn: () => getSectionSchemas(storeId),
    enabled: !!storeId,
  });
}
