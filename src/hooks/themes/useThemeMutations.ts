'use client';

/**
 * Hook for theme mutations (create, update, delete, publish, duplicate).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTheme,
  updateTheme,
  deleteTheme,
  publishTheme,
  duplicateTheme,
} from '@/lib/api/themes';
import { queryKeys } from '@/lib/queryKeys';
import type {
  Theme,
  CreateThemePayload,
  UpdateThemePayload,
  DuplicateThemePayload,
} from '@/types/theme';
import type { ApiError } from '@/types/api';

/**
 * Create theme mutation.
 */
export function useCreateTheme(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<Theme, ApiError, CreateThemePayload>({
    mutationFn: (payload) => createTheme(storeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeId).lists(),
      });
    },
  });
}

/**
 * Update theme mutation.
 */
export function useUpdateTheme(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Theme,
    ApiError,
    { themeId: string; payload: UpdateThemePayload }
  >({
    mutationFn: ({ themeId, payload }) => updateTheme(storeId, themeId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeId).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeId).detail(variables.themeId),
      });
    },
  });
}

/**
 * Delete theme mutation.
 */
export function useDeleteTheme(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (themeId) => deleteTheme(storeId, themeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeId).lists(),
      });
    },
  });
}

/**
 * Publish theme mutation.
 */
export function usePublishTheme(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<Theme, ApiError, string>({
    mutationFn: (themeId) => publishTheme(storeId, themeId),
    onSuccess: () => {
      // Invalidate all theme queries since publishing affects is_active status
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeId).all(),
      });
    },
  });
}

/**
 * Duplicate theme mutation.
 */
export function useDuplicateTheme(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Theme,
    ApiError,
    { themeId: string; payload: DuplicateThemePayload }
  >({
    mutationFn: ({ themeId, payload }) =>
      duplicateTheme(storeId, themeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeId).lists(),
      });
    },
  });
}
