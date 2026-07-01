/**
 * React Query hooks for shipping zones management.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type {
  ShippingZone,
  CreateShippingZonePayload,
  UpdateShippingZonePayload,
  AssignMethodToZonePayload,
  UpdateZoneMethodPricePayload,
} from '@/types/shipping';
import {
  getShippingZones,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
  assignMethodToZone,
  removeMethodFromZone,
  updateZoneMethodPrice,
} from '@/lib/api/shipping';

/**
 * Query key factory for shipping zones.
 */
export const shippingZonesKeys = {
  all: ['shipping-zones'] as const,
  lists: () => [...shippingZonesKeys.all, 'list'] as const,
  list: (storeSlug: string) => [...shippingZonesKeys.lists(), { storeSlug }] as const,
  detail: (storeSlug: string, zoneId: string) => 
    [...shippingZonesKeys.all, 'detail', { storeSlug, zoneId }] as const,
};

/**
 * Fetch all shipping zones for a store.
 */
export function useShippingZones(storeSlug: string) {
  return useQuery({
    queryKey: shippingZonesKeys.list(storeSlug),
    queryFn: () => getShippingZones(storeSlug),
    enabled: !!storeSlug,
  });
}

/**
 * Create a new shipping zone.
 */
export function useCreateShippingZone(storeSlug: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateShippingZonePayload) =>
      createShippingZone(storeSlug, payload),
    onSuccess: (newZone) => {
      queryClient.invalidateQueries({ queryKey: shippingZonesKeys.lists() });
      toast({
        title: 'Success',
        description: `Shipping zone "${newZone.name}" created successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to create shipping zone.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Update a shipping zone.
 */
export function useUpdateShippingZone(storeSlug: string, zoneId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateShippingZonePayload) =>
      updateShippingZone(storeSlug, zoneId, payload),
    onSuccess: (updatedZone) => {
      queryClient.invalidateQueries({ queryKey: shippingZonesKeys.lists() });
      toast({
        title: 'Success',
        description: `Shipping zone "${updatedZone.name}" updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update shipping zone.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Delete a shipping zone.
 */
export function useDeleteShippingZone(storeSlug: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (zoneId: string) => deleteShippingZone(storeSlug, zoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingZonesKeys.lists() });
      toast({
        title: 'Success',
        description: 'Shipping zone deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to delete shipping zone.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Assign a shipping method to a zone.
 */
export function useAssignMethodToZone(storeSlug: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ zoneId, payload }: { zoneId: string; payload: AssignMethodToZonePayload }) =>
      assignMethodToZone(storeSlug, zoneId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingZonesKeys.lists() });
      toast({
        title: 'Success',
        description: 'Shipping method assigned to zone successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to assign method to zone.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Remove a shipping method from a zone.
 */
export function useRemoveMethodFromZone(storeSlug: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ zoneId, methodId }: { zoneId: string; methodId: string }) =>
      removeMethodFromZone(storeSlug, zoneId, methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingZonesKeys.lists() });
      toast({
        title: 'Success',
        description: 'Shipping method removed from zone successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to remove method from zone.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Update zone-specific price override.
 */
export function useUpdateZoneMethodPrice(storeSlug: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ 
      zoneId, 
      methodId, 
      payload 
    }: { 
      zoneId: string; 
      methodId: string; 
      payload: UpdateZoneMethodPricePayload 
    }) => updateZoneMethodPrice(storeSlug, zoneId, methodId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingZonesKeys.lists() });
      toast({
        title: 'Success',
        description: 'Zone pricing updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update zone pricing.',
        variant: 'destructive',
      });
    },
  });
}
