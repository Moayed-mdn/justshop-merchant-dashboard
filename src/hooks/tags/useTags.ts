// src/hooks/tags/useTags.ts
import { useQuery } from '@tanstack/react-query';
import type { TagFilters } from '@/schemas/tags';
import type { TagListItemView } from '@/types/tag';
import type { PaginatedResponse } from '@/types/api';
import { getTags } from '@/lib/api/tags';

export function useTags(storeSlug: string, filters?: TagFilters) {
  return useQuery<PaginatedResponse<TagListItemView>>({
    queryKey: ['tags', storeSlug, filters],
    queryFn:  () => getTags(storeSlug, filters),
    enabled:  !!storeSlug,
  });
}