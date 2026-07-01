/**
 * React Query hooks for store address settings.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type {
  StoreAddressSetting,
  UpdateStoreAddressSettingsPayload,
} from '@/types/shipping';
import {
  getAddressSettings,
  updateAddressSettings,
} from '@/lib/api/shipping';

/**
 * Query key factory for address settings.
 */
export const addressSettingsKeys = {
  all: ['address-settings'] as const,
  detail: (storeSlug: string) => [...addressSettingsKeys.all, { storeSlug }] as const,
};

/**
 * Fetch store address settings.
 */
export function useAddressSettings(storeSlug: string) {
  return useQuery({
    queryKey: addressSettingsKeys.detail(storeSlug),
    queryFn: () => getAddressSettings(storeSlug),
    enabled: !!storeSlug,
  });
}

/**
 * Update store address settings.
 */
export function useUpdateAddressSettings(storeSlug: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateStoreAddressSettingsPayload) =>
      updateAddressSettings(storeSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressSettingsKeys.all });
      toast({
        title: 'Success',
        description: 'Address settings updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update address settings.',
        variant: 'destructive',
      });
    },
  });
}
