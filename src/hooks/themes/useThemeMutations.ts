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
export function useCreateTheme(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<Theme, ApiError, CreateThemePayload>({
    mutationFn: (payload) => createTheme(storeSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeSlug).lists(),
      });
    },
  });
}

/**
 * Update theme mutation.
 */
export function useUpdateTheme(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Theme,
    ApiError,
    { themeSlug: string; payload: UpdateThemePayload }
  >({
    mutationFn: ({ themeSlug, payload }) => updateTheme(storeSlug, themeSlug, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeSlug).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeSlug).detail(variables.themeSlug),
      });
    },
  });
}

/**
 * Delete theme mutation.
 */
export function useDeleteTheme(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (themeSlug) => deleteTheme(storeSlug, themeSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeSlug).lists(),
      });
    },
  });
}

/**
 * Publish theme mutation.
 */
export function usePublishTheme(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<Theme, ApiError, string>({
    mutationFn: (themeSlug) => publishTheme(storeSlug, themeSlug),
    onSuccess: () => {
      // Invalidate all theme queries since publishing affects is_active status
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeSlug).all(),
      });
    },
  });
}

/**
 * Duplicate theme mutation.
 */
export function useDuplicateTheme(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Theme,
    ApiError,
    { themeSlug: string; payload: DuplicateThemePayload }
  >({
    mutationFn: ({ themeSlug, payload }) =>
      duplicateTheme(storeSlug, themeSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeSlug).lists(),
      });
    },
  });
}
