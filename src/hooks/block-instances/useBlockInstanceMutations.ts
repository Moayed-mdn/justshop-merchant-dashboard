'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBlockInstance, updateBlockInstance, deleteBlockInstance, reorderBlockInstances } from '@/lib/api/block-instances';
import { queryKeys } from '@/lib/queryKeys';
import type { ThemeBlockInstance, CreateBlockInstancePayload } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useCreateBlockInstance(storeSlug: string, themeIdentifier: string, sectionId: string) {
  const queryClient = useQueryClient();

  return useMutation<ThemeBlockInstance, ApiError, CreateBlockInstancePayload>({
    mutationFn: (payload) => createBlockInstance(storeSlug, themeIdentifier, sectionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.blockInstances(storeSlug, themeIdentifier, sectionId).all(),
      });
    },
  });
}

export function useUpdateBlockInstance(storeSlug: string, themeIdentifier: string, sectionId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ThemeBlockInstance,
    ApiError,
    { blockInstanceId: string; payload: Partial<CreateBlockInstancePayload> & { is_enabled?: boolean } }
  >({
    mutationFn: ({ blockInstanceId, payload }) =>
      updateBlockInstance(storeSlug, themeIdentifier, sectionId, blockInstanceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.blockInstances(storeSlug, themeIdentifier, sectionId).all(),
      });
    },
  });
}

export function useDeleteBlockInstance(storeSlug: string, themeIdentifier: string, sectionId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (blockInstanceId) => deleteBlockInstance(storeSlug, themeIdentifier, sectionId, blockInstanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.blockInstances(storeSlug, themeIdentifier, sectionId).all(),
      });
    },
  });
}

export function useReorderBlockInstances(storeSlug: string, themeIdentifier: string, sectionId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number[]>({
    mutationFn: (blockIds) => reorderBlockInstances(storeSlug, themeIdentifier, sectionId, blockIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.blockInstances(storeSlug, themeIdentifier, sectionId).all(),
      });
    },
  });
}
