/**
 * React Query hooks for shipping zones management.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/api';
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
import { queryKeys } from '@/lib/queryKeys';

/**
 * Fetch all shipping zones for a store.
 */
export function useShippingZones(storeSlug: string) {
  return useQuery({
    queryKey: queryKeys.shipping.zones(storeSlug).lists(),
    queryFn: () => getShippingZones(storeSlug),
    enabled: !!storeSlug,
  });
}

/**
 * Create a new shipping zone.
 */
export function useCreateShippingZone(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<ShippingZone, ApiError, CreateShippingZonePayload>({
    mutationFn: (payload) => createShippingZone(storeSlug, payload),
    onSuccess: (newZone) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.zones(storeSlug).lists() });
      toast.success(`Shipping zone "${newZone.name}" created successfully.`);
    },
    onError: (error) => {
      logger.error('Failed to create shipping zone', error);
      toast.error(error.message || 'Failed to create shipping zone.');
    },
  });
}

/**
 * Update a shipping zone.
 */
export function useUpdateShippingZone(storeSlug: string, zoneId: string) {
  const queryClient = useQueryClient();

  return useMutation<ShippingZone, ApiError, UpdateShippingZonePayload>({
    mutationFn: (payload) => updateShippingZone(storeSlug, zoneId, payload),
    onSuccess: (updatedZone) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.zones(storeSlug).lists() });
      toast.success(`Shipping zone "${updatedZone.name}" updated successfully.`);
    },
    onError: (error) => {
      logger.error('Failed to update shipping zone', error);
      toast.error(error.message || 'Failed to update shipping zone.');
    },
  });
}

/**
 * Delete a shipping zone.
 */
export function useDeleteShippingZone(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (zoneId) => deleteShippingZone(storeSlug, zoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.zones(storeSlug).lists() });
      toast.success('Shipping zone deleted successfully.');
    },
    onError: (error) => {
      logger.error('Failed to delete shipping zone', error);
      toast.error(error.message || 'Failed to delete shipping zone.');
    },
  });
}

/**
 * Assign a shipping method to a zone.
 */
export function useAssignMethodToZone(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<ShippingZone, ApiError, { zoneId: string; payload: AssignMethodToZonePayload }>({
    mutationFn: ({ zoneId, payload }) => assignMethodToZone(storeSlug, zoneId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.zones(storeSlug).lists() });
      toast.success('Shipping method assigned to zone successfully.');
    },
    onError: (error) => {
      logger.error('Failed to assign method to zone', error);
      toast.error(error.message || 'Failed to assign method to zone.');
    },
  });
}

/**
 * Remove a shipping method from a zone.
 */
export function useRemoveMethodFromZone(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { zoneId: string; methodId: string }>({
    mutationFn: ({ zoneId, methodId }) => removeMethodFromZone(storeSlug, zoneId, methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.zones(storeSlug).lists() });
      toast.success('Shipping method removed from zone successfully.');
    },
    onError: (error) => {
      logger.error('Failed to remove method from zone', error);
      toast.error(error.message || 'Failed to remove method from zone.');
    },
  });
}

/**
 * Update zone-specific price override.
 */
export function useUpdateZoneMethodPrice(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<ShippingZone, ApiError, { zoneId: string; methodId: string; payload: UpdateZoneMethodPricePayload }>({
    mutationFn: ({ zoneId, methodId, payload }) => updateZoneMethodPrice(storeSlug, zoneId, methodId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.zones(storeSlug).lists() });
      toast.success('Zone pricing updated successfully.');
    },
    onError: (error) => {
      logger.error('Failed to update zone pricing', error);
      toast.error(error.message || 'Failed to update zone pricing.');
    },
  });
}
