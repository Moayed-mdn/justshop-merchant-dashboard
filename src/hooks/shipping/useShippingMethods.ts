/**
 * React Query hooks for shipping methods management.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
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

/**
 * Query key factory for shipping methods.
 */
export const shippingMethodsKeys = {
  all: ['shipping-methods'] as const,
  lists: () => [...shippingMethodsKeys.all, 'list'] as const,
  list: (storeSlug: string) => [...shippingMethodsKeys.lists(), { storeSlug }] as const,
  detail: (storeSlug: string, methodId: string) => 
    [...shippingMethodsKeys.all, 'detail', { storeSlug, methodId }] as const,
};

/**
 * Fetch all shipping methods for a store.
 */
export function useShippingMethods(storeSlug: string) {
  return useQuery({
    queryKey: shippingMethodsKeys.list(storeSlug),
    queryFn: () => getShippingMethods(storeSlug),
    enabled: !!storeSlug,
  });
}

/**
 * Create a new shipping method.
 */
export function useCreateShippingMethod(storeSlug: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateShippingMethodPayload) =>
      createShippingMethod(storeSlug, payload),
    onSuccess: (newMethod) => {
      queryClient.invalidateQueries({ queryKey: shippingMethodsKeys.lists() });
      toast({
        title: 'Success',
        description: `Shipping method "${newMethod.name}" created successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to create shipping method.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Update a shipping method.
 */
export function useUpdateShippingMethod(storeSlug: string, methodId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateShippingMethodPayload) =>
      updateShippingMethod(storeSlug, methodId, payload),
    onSuccess: (updatedMethod) => {
      queryClient.invalidateQueries({ queryKey: shippingMethodsKeys.lists() });
      toast({
        title: 'Success',
        description: `Shipping method "${updatedMethod.name}" updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update shipping method.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Delete a shipping method.
 */
export function useDeleteShippingMethod(storeSlug: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (methodId: string) => deleteShippingMethod(storeSlug, methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingMethodsKeys.lists() });
      toast({
        title: 'Success',
        description: 'Shipping method deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to delete shipping method.',
        variant: 'destructive',
      });
    },
  });
}
