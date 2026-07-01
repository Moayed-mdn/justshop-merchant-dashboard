/**
 * Store Asset types for the theme system.
 *
 * Raw types  → exact shape returned by Laravel StoreAssetResource.
 * View types → mapped shape consumed by UI components.
 */

// ── Raw API types ─────────────────────────────────────────────────────────

/** Asset type enum values */
export type AssetType = 'logo' | 'favicon' | 'banner' | 'other';

/** Store asset - raw API shape */
export interface StoreAsset {
  id: number;
  store_id: number;
  asset_type: AssetType;
  file_name: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
}

/** Store asset list item - raw API shape (same as detail for assets) */
export type StoreAssetListItem = StoreAsset;

// ── View types ────────────────────────────────────────────────────────────

/** Store asset - mapped for UI consumption */
export interface StoreAssetView {
  id: number;
  storeSlug: string;
  assetType: AssetType;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Store asset list item - mapped for UI */
export type StoreAssetListItemView = StoreAssetView;

// ── Form types ────────────────────────────────────────────────────────────

/** Payload sent to POST /assets (multipart/form-data) */
export interface UploadAssetPayload {
  file: File;
  asset_type: AssetType;
  alt_text?: string;
}

/** Payload sent to PATCH /assets/:id */
export interface UpdateAssetPayload {
  alt_text: string | null;
  asset_type: AssetType;
}

// ── Filter types ──────────────────────────────────────────────────────────

export interface AssetFilters {
  page: number;
  perPage: number;
  asset_type?: AssetType | 'all';
}

// ── Upload state types ────────────────────────────────────────────────────

export interface UploadProgress {
  file: File;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
