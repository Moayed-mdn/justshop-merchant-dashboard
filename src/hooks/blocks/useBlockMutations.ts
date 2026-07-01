'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBlock } from '@/lib/api/blocks';
import { queryKeys } from '@/lib/queryKeys';
import type { ThemeBlock } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useUpdateBlock(storeSlug: string, themeIdentifier: string, sectionId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ThemeBlock,
    ApiError,
    { blockId: string; payload: Partial<{ name: string; settings: Record<string, unknown>; content: Record<string, unknown>; position: number; is_enabled: boolean }> }
  >({
    mutationFn: ({ blockId, payload }) =>
      updateBlock(storeSlug, themeIdentifier, sectionId, blockId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['merchant', storeSlug, 'blocks', themeIdentifier, sectionId],
      });
      // Blocks are nested inside the system template detail response,
      // so also invalidate any cached system template data for this store+theme
      queryClient.invalidateQueries({
        queryKey: queryKeys.systemTemplates(storeSlug, themeIdentifier).all(),
      });
    },
  });
}
