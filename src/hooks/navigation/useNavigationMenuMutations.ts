'use client';

/**
 * Mutation hooks for navigation menu CRUD operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
  createNavigationMenu,
  updateNavigationMenu,
  deleteNavigationMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} from '@/lib/api/navigation';
import type {
  CreateNavigationMenuPayload,
  UpdateNavigationMenuPayload,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  ReorderMenuItemsPayload,
} from '@/types/navigation';
import type { ApiError } from '@/types/api';

/** Create navigation menu */
export function useCreateNavigationMenu(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, CreateNavigationMenuPayload>({
    mutationFn: (payload) => createNavigationMenu(storeSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeSlug).all(),
      });
    },
  });
}

/** Update navigation menu */
export function useUpdateNavigationMenu(storeSlug: string, menuId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, UpdateNavigationMenuPayload>({
    mutationFn: (payload) => updateNavigationMenu(storeSlug, menuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeSlug).detail(menuId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeSlug).lists(),
      });
    },
  });
}

/** Delete navigation menu */
export function useDeleteNavigationMenu(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (menuId) => deleteNavigationMenu(storeSlug, menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeSlug).all(),
      });
    },
  });
}

/** Create menu item */
export function useCreateMenuItem(storeSlug: string, menuId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, CreateMenuItemPayload>({
    mutationFn: (payload) => createMenuItem(storeSlug, menuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeSlug).detail(menuId),
      });
    },
  });
}

/** Update menu item */
export function useUpdateMenuItem(
  storeSlug: string,
  menuId: string,
  itemId: string,
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, UpdateMenuItemPayload>({
    mutationFn: (payload) => updateMenuItem(storeSlug, menuId, itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeSlug).detail(menuId),
      });
    },
  });
}

/** Delete menu item */
export function useDeleteMenuItem(storeSlug: string, menuId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (itemId) => deleteMenuItem(storeSlug, menuId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeSlug).detail(menuId),
      });
    },
  });
}

/** Reorder menu items */
export function useReorderMenuItems(storeSlug: string, menuId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, ReorderMenuItemsPayload>({
    mutationFn: (payload) => reorderMenuItems(storeSlug, menuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeSlug).detail(menuId),
      });
    },
  });
}
