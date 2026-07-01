/**
 * Mappers for Store Assets.
 * Transform raw API responses to view-friendly camelCase types.
 */

import type { StoreAsset, StoreAssetView } from '@/types/asset';

/**
 * Map raw API store asset to view type.
 */
export function mapStoreAsset(asset: StoreAsset, storeSlug: string): StoreAssetView {
  return {
    id: asset.id,
    storeSlug,
    assetType: asset.asset_type,
    fileName: asset.file_name,
    filePath: asset.file_path,
    fileUrl: asset.file_url,
    mimeType: asset.mime_type,
    fileSize: asset.file_size,
    altText: asset.alt_text,
    createdAt: asset.created_at,
    updatedAt: asset.updated_at,
  };
}
