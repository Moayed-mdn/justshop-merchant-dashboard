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
export function useCreateNavigationMenu(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, CreateNavigationMenuPayload>({
    mutationFn: (payload) => createNavigationMenu(storeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeId).all,
      });
    },
  });
}

/** Update navigation menu */
export function useUpdateNavigationMenu(storeId: string, menuId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, UpdateNavigationMenuPayload>({
    mutationFn: (payload) => updateNavigationMenu(storeId, menuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeId).detail(menuId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeId).lists(),
      });
    },
  });
}

/** Delete navigation menu */
export function useDeleteNavigationMenu(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (menuId) => deleteNavigationMenu(storeId, menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeId).all,
      });
    },
  });
}

/** Create menu item */
export function useCreateMenuItem(storeId: string, menuId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, CreateMenuItemPayload>({
    mutationFn: (payload) => createMenuItem(storeId, menuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeId).detail(menuId),
      });
    },
  });
}

/** Update menu item */
export function useUpdateMenuItem(
  storeId: string,
  menuId: string,
  itemId: string,
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, UpdateMenuItemPayload>({
    mutationFn: (payload) => updateMenuItem(storeId, menuId, itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeId).detail(menuId),
      });
    },
  });
}

/** Delete menu item */
export function useDeleteMenuItem(storeId: string, menuId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (itemId) => deleteMenuItem(storeId, menuId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeId).detail(menuId),
      });
    },
  });
}

/** Reorder menu items */
export function useReorderMenuItems(storeId: string, menuId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, ReorderMenuItemsPayload>({
    mutationFn: (payload) => reorderMenuItems(storeId, menuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.navigation(storeId).detail(menuId),
      });
    },
  });
}
