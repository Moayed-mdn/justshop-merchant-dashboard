/**
 * React Query hooks for shipping methods management.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/api';
import type {
  ShippingMethod,
  CreateShippingMethodPayload,
  UpdateShippingMethodPayload,
} from '@/types/shipping';
import {
  getShippingMethods,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
} from '@/lib/api/shipping';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Fetch all shipping methods for a store.
 */
export function useShippingMethods(storeSlug: string) {
  return useQuery({
    queryKey: queryKeys.shipping.methods(storeSlug).lists(),
    queryFn: () => getShippingMethods(storeSlug),
    enabled: !!storeSlug,
  });
}

/**
 * Create a new shipping method.
 */
export function useCreateShippingMethod(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<ShippingMethod, ApiError, CreateShippingMethodPayload>({
    mutationFn: (payload) => createShippingMethod(storeSlug, payload),
    onSuccess: (newMethod) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.methods(storeSlug).lists() });
      toast.success(`Shipping method "${newMethod.name}" created successfully.`);
    },
    onError: (error) => {
      logger.error('Failed to create shipping method', error);
      toast.error(error.message || 'Failed to create shipping method.');
    },
  });
}

/**
 * Update a shipping method.
 */
export function useUpdateShippingMethod(storeSlug: string, methodId: string) {
  const queryClient = useQueryClient();

  return useMutation<ShippingMethod, ApiError, UpdateShippingMethodPayload>({
    mutationFn: (payload) => updateShippingMethod(storeSlug, methodId, payload),
    onSuccess: (updatedMethod) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.methods(storeSlug).lists() });
      toast.success(`Shipping method "${updatedMethod.name}" updated successfully.`);
    },
    onError: (error) => {
      logger.error('Failed to update shipping method', error);
      toast.error(error.message || 'Failed to update shipping method.');
    },
  });
}

/**
 * Delete a shipping method.
 */
export function useDeleteShippingMethod(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (methodId) => deleteShippingMethod(storeSlug, methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.methods(storeSlug).lists() });
      toast.success('Shipping method deleted successfully.');
    },
    onError: (error) => {
      logger.error('Failed to delete shipping method', error);
      toast.error(error.message || 'Failed to delete shipping method.');
    },
  });
}
