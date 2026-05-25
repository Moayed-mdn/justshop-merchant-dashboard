/**
 * API functions for store-related endpoints.
 * Client-side store lifecycle API helpers.
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type { Store, ProvisioningStatus, CreateStorePayload } from '@/types/store';
import { API_ROUTES } from '@/config/routes';

interface RequestOptions {
  signal?: AbortSignal;
}

/**
 * Create a new store.
 */
export async function createStore(
  payload: CreateStorePayload,
  options: RequestOptions = {}
): Promise<ApiResponse<Store>> {
  return clientApi.post(API_ROUTES.merchant.stores.create(), payload, { signal: options.signal });
}

/**
 * Check if a store slug is available.
 */
export async function checkSlugAvailability(
  slug: string,
  options: RequestOptions = {}
): Promise<ApiResponse<{ available: boolean }>> {
  return clientApi.get(API_ROUTES.merchant.stores.slugCheck(slug), { signal: options.signal });
}

/**
 * Get provisioning status for a store.
 */
export async function getProvisioningStatus(
  storeId: string,
  options: RequestOptions = {}
): Promise<ApiResponse<ProvisioningStatus>> {
  return clientApi.get(API_ROUTES.merchant.stores.provisioningStatus(storeId), { signal: options.signal });
}
