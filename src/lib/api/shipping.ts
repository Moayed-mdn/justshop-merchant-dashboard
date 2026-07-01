/**
 * Shipping API functions (client-side).
 * Provides methods for merchants to manage shipping configuration.
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import { API_ROUTES } from '@/config/routes';
import type {
  ShippingMethod,
  ShippingZone,
  StoreAddressSetting,
  CreateShippingMethodPayload,
  UpdateShippingMethodPayload,
  CreateShippingZonePayload,
  UpdateShippingZonePayload,
  UpdateStoreAddressSettingsPayload,
  AssignMethodToZonePayload,
  UpdateZoneMethodPricePayload,
} from '@/types/shipping';

// ========== STORE ADDRESS SETTINGS ==========

/**
 * Get store address settings.
 */
export async function getAddressSettings(
  storeSlug: string
): Promise<StoreAddressSetting> {
  const response = await clientApi.get<ApiResponse<StoreAddressSetting>>(
    API_ROUTES.store(storeSlug).shipping().addressSettings.get()
  );
  return response.data;
}

/**
 * Update store address settings.
 */
export async function updateAddressSettings(
  storeSlug: string,
  payload: UpdateStoreAddressSettingsPayload
): Promise<StoreAddressSetting> {
  const response = await clientApi.put<ApiResponse<StoreAddressSetting>>(
    API_ROUTES.store(storeSlug).shipping().addressSettings.update(),
    payload
  );
  return response.data;
}

// ========== SHIPPING ZONES ==========

/**
 * Get all shipping zones for a store.
 */
export async function getShippingZones(
  storeSlug: string
): Promise<ShippingZone[]> {
  const response = await clientApi.get<ApiResponse<ShippingZone[]>>(
    API_ROUTES.store(storeSlug).shipping().zones.list()
  );
  return response.data;
}

/**
 * Create a new shipping zone.
 */
export async function createShippingZone(
  storeSlug: string,
  payload: CreateShippingZonePayload
): Promise<ShippingZone> {
  const response = await clientApi.post<ApiResponse<ShippingZone>>(
    API_ROUTES.store(storeSlug).shipping().zones.create(),
    payload
  );
  return response.data;
}

/**
 * Update a shipping zone.
 */
export async function updateShippingZone(
  storeSlug: string,
  zoneId: string,
  payload: UpdateShippingZonePayload
): Promise<ShippingZone> {
  const response = await clientApi.put<ApiResponse<ShippingZone>>(
    API_ROUTES.store(storeSlug).shipping().zones.update(zoneId),
    payload
  );
  return response.data;
}

/**
 * Delete a shipping zone.
 */
export async function deleteShippingZone(
  storeSlug: string,
  zoneId: string
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeSlug).shipping().zones.delete(zoneId)
  );
}

// ========== SHIPPING METHODS ==========

/**
 * Get all shipping methods for a store.
 */
export async function getShippingMethods(
  storeSlug: string
): Promise<ShippingMethod[]> {
  const response = await clientApi.get<ApiResponse<ShippingMethod[]>>(
    API_ROUTES.store(storeSlug).shipping().methods.list()
  );
  return response.data;
}

/**
 * Create a new shipping method.
 */
export async function createShippingMethod(
  storeSlug: string,
  payload: CreateShippingMethodPayload
): Promise<ShippingMethod> {
  const response = await clientApi.post<ApiResponse<ShippingMethod>>(
    API_ROUTES.store(storeSlug).shipping().methods.create(),
    payload
  );
  return response.data;
}

/**
 * Update a shipping method.
 */
export async function updateShippingMethod(
  storeSlug: string,
  methodId: string,
  payload: UpdateShippingMethodPayload
): Promise<ShippingMethod> {
  const response = await clientApi.put<ApiResponse<ShippingMethod>>(
    API_ROUTES.store(storeSlug).shipping().methods.update(methodId),
    payload
  );
  return response.data;
}

/**
 * Delete a shipping method.
 */
export async function deleteShippingMethod(
  storeSlug: string,
  methodId: string
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeSlug).shipping().methods.delete(methodId)
  );
}

// ========== ZONE-METHOD ASSIGNMENT ==========

/**
 * Assign a shipping method to a zone.
 */
export async function assignMethodToZone(
  storeSlug: string,
  zoneId: string,
  payload: AssignMethodToZonePayload
): Promise<ShippingZone> {
  const response = await clientApi.post<ApiResponse<ShippingZone>>(
    API_ROUTES.store(storeSlug).shipping().zones.assignMethod(zoneId),
    payload
  );
  return response.data;
}

/**
 * Remove a shipping method from a zone.
 */
export async function removeMethodFromZone(
  storeSlug: string,
  zoneId: string,
  methodId: string
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeSlug).shipping().zones.removeMethod(zoneId, methodId)
  );
}

/**
 * Update zone-specific price override for a method.
 */
export async function updateZoneMethodPrice(
  storeSlug: string,
  zoneId: string,
  methodId: string,
  payload: UpdateZoneMethodPricePayload
): Promise<ShippingZone> {
  const response = await clientApi.put<ApiResponse<ShippingZone>>(
    API_ROUTES.store(storeSlug).shipping().zones.updateMethodPrice(zoneId, methodId),
    payload
  );
  return response.data;
}
