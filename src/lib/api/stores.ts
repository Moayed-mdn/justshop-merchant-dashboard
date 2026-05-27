/**
 * Stores API functions (client-side).
 */

import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse } from '@/types/api';
import type { Store, ProvisioningStatus, CreateStorePayload, UpdateStorePayload } from '@/types/store';

interface RequestOptions {
  signal?: AbortSignal;
}

/**
 * Get a store by ID.
 */
export async function getStore(
  storeId: string,
  options: RequestOptions = {}
): Promise<ApiResponse<Store>> {
  return clientApi.get(API_ROUTES.merchant.stores.detail(storeId), { signal: options.signal });
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
 * Update a store.
 */
export async function updateStore(
  storeId: string,
  payload: UpdateStorePayload,
  options: RequestOptions = {}
): Promise<ApiResponse<Store>> {
  return clientApi.put(API_ROUTES.merchant.stores.update(storeId), payload, { signal: options.signal });
}

/**
 * Check if a store slug is available.
 */
export async function checkStoreSlug(
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
