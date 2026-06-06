/**
 * Store Assets API functions (client-side).
 * All calls go through clientApi → /api/proxy → Laravel.
 */

import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  StoreAsset,
  UploadAssetPayload,
  UpdateAssetPayload,
  AssetFilters,
} from '@/types/asset';

/**
 * Fetch paginated assets list.
 */
export async function getAssets(
  storeId: string,
  filters: AssetFilters,
): Promise<PaginatedResponse<StoreAsset>> {
  const params: Record<string, string | number> = {};

  if (filters.page !== 1) params.page = filters.page;
  if (filters.perPage !== 15) params.per_page = filters.perPage;
  if (filters.asset_type && filters.asset_type !== 'all') {
    params.asset_type = filters.asset_type;
  }

  return clientApi.get<PaginatedResponse<StoreAsset>>(
    API_ROUTES.store(storeId).assets().list(),
    { params },
  );
}

/**
 * Upload a new asset.
 * Sends multipart/form-data with file and metadata.
 */
export async function uploadAsset(
  storeId: string,
  payload: UploadAssetPayload,
): Promise<StoreAsset> {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('asset_type', payload.asset_type);
  if (payload.alt_text) {
    formData.append('alt_text', payload.alt_text);
  }

  const response = await clientApi.post<ApiResponse<StoreAsset>>(
    API_ROUTES.store(storeId).assets().upload(),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}

/**
 * Update an existing asset's metadata.
 */
export async function updateAsset(
  storeId: string,
  assetId: string,
  payload: UpdateAssetPayload,
): Promise<StoreAsset> {
  const response = await clientApi.patch<ApiResponse<StoreAsset>>(
    API_ROUTES.store(storeId).assets().update(assetId),
    payload,
  );
  return response.data;
}

/**
 * Delete an asset.
 */
export async function deleteAsset(
  storeId: string,
  assetId: string,
): Promise<void> {
  await clientApi.delete(API_ROUTES.store(storeId).assets().delete(assetId));
}
