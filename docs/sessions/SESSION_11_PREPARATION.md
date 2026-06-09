# SESSION 11: Asset Library & Logo Uploader - Preparation Document

**Status**: 📋 Planning Phase  
**Target Duration**: 3-4 hours  
**Priority**: High  
**Date**: June 6, 2026

---

## 📋 Executive Summary

This document outlines the complete implementation plan for SESSION 11: Asset Library & Logo Uploader UI. This is the second of three frontend sessions for the Theme System implementation.

**Dependencies**: SESSION 7 (Backend API) ✅ Complete  
**Reference**: SESSION 10 (Navigation Builder) ✅ Complete  
**Next**: SESSION 12 (Theme Overview & Settings)

---

## 🎯 Session Objectives

### Primary Goals
1. Create asset library page with grid view
2. Implement drag-and-drop file upload
3. Build logo/favicon uploader components
4. Add image preview functionality
5. Enable asset management (delete, update metadata)
6. Support alt text for accessibility

### Technical Goals
1. Follow SESSION 10 patterns exactly
2. 100% architecture compliance
3. Type-safe API integration
4. Proper error handling
5. Loading states throughout
6. Responsive mobile design
7. Multilingual support (EN + AR)

---

## 📊 Backend API Review

### Available Endpoints (Already Built)

```
GET    /api/v1/merchant/stores/{store}/assets         # List assets
POST   /api/v1/merchant/stores/{store}/assets         # Upload asset
PATCH  /api/v1/merchant/stores/{store}/assets/{asset} # Update asset
DELETE /api/v1/merchant/stores/{store}/assets/{asset} # Delete asset
```

### Asset Type Enum (Backend)
```php
enum AssetTypeEnum: string
{
    case LOGO = 'logo';
    case FAVICON = 'favicon';
    case BANNER = 'banner';
    case OTHER = 'other';
}
```

### Store Model Fields
```php
// stores table has:
- logo_url (string, nullable)
- favicon_url (string, nullable)
```

---

## 🗂️ File Structure Plan

### Files to Create (11 files total)

#### 1. Type Definitions (1 file)
```
laratenant-commerce/src/types/asset.ts
```
**Purpose**: Define all asset-related types
**Exports**:
- `StoreAsset` (raw API type)
- `StoreAssetView` (mapped type)
- `CreateAssetPayload`
- `UpdateAssetPayload`
- `AssetFilters`
- `AssetType` (enum)

#### 2. API Client (1 file)
```
laratenant-commerce/src/lib/api/assets.ts
```
**Purpose**: Client-side API functions
**Functions**:
- `getAssets(storeId, filters)` → List with pagination
- `uploadAsset(storeId, payload)` → Upload new asset
- `updateAsset(storeId, assetId, payload)` → Update metadata
- `deleteAsset(storeId, assetId)` → Delete asset

#### 3. Data Mapper (1 file)
```
laratenant-commerce/src/lib/mappers/asset.ts
```
**Purpose**: Transform API responses to view models
**Functions**:
- `mapStoreAsset(raw)` → Convert snake_case to camelCase
- `mapStoreAssetList(raw[])` → Map array

#### 4. React Query Hooks (3 files)
```
laratenant-commerce/src/hooks/assets/useAssets.ts
laratenant-commerce/src/hooks/assets/useAsset.ts (optional, for future)
laratenant-commerce/src/hooks/assets/useAssetMutations.ts
```
**Purpose**: Server state management
**Hooks**:
- `useAssets(storeId, filters)` → List hook with pagination
- `useUploadAsset(storeId)` → Upload mutation
- `useUpdateAsset(storeId)` → Update mutation
- `useDeleteAsset(storeId)` → Delete mutation

#### 5. Pages (1 file)
```
laratenant-commerce/src/app/[locale]/(merchant)/merchant/theme/assets/page.tsx
```
**Purpose**: Asset library main page (Server Component)
**Features**:
- Page metadata
- Initial filters from URL params
- Render AssetLibraryContent

#### 6. Feature Components (5 files)
```
laratenant-commerce/src/features/theme/assets/AssetLibraryContent.tsx
laratenant-commerce/src/features/theme/assets/AssetGrid.tsx
laratenant-commerce/src/features/theme/assets/AssetCard.tsx
laratenant-commerce/src/features/theme/assets/AssetUploader.tsx
laratenant-commerce/src/features/theme/assets/LogoFaviconUploader.tsx
```

**Component Breakdown**:

**AssetLibraryContent.tsx** (Client Component):
- Main container with state management
- Header with upload button
- Filter controls (by asset type)
- Pagination controls
- Renders AssetGrid

**AssetGrid.tsx** (Client Component):
- Grid layout (responsive)
- Empty state handling
- Loading skeleton
- Maps assets to AssetCard

**AssetCard.tsx** (Client Component):
- Single asset display
- Image thumbnail
- Asset type badge
- Alt text display
- Edit/Delete actions
- Click to preview modal

**AssetUploader.tsx** (Client Component):
- Drag-and-drop zone
- File input fallback
- File type validation
- Multiple file support
- Preview thumbnails
- Upload progress
- Error handling

**LogoFaviconUploader.tsx** (Client Component):
- Dedicated uploader for logo/favicon
- Single file only
- Current logo/favicon display
- Replace functionality
- Direct update to stores table

---

## 🎨 Component Architecture

### Data Flow

```
Page (RSC)
  ↓
AssetLibraryContent (Client)
  ├── useAssets(storeId, filters)
  ├── useUploadAsset(storeId)
  ├── useUpdateAsset(storeId)
  └── useDeleteAsset(storeId)
      ↓
API Client
  ↓
/api/proxy
  ↓
Laravel Backend
```

### Component Hierarchy

```
page.tsx (Server Component)
└── AssetLibraryContent (Client Component)
    ├── Header
    │   ├── Title & Description
    │   └── Upload Button → Opens AssetUploader Dialog
    ├── Filters
    │   ├── Asset Type Filter
    │   └── Search Input (future)
    ├── Logo/Favicon Section
    │   └── LogoFaviconUploader
    ├── AssetGrid
    │   └── AssetCard[] (map)
    │       ├── Image Thumbnail
    │       ├── Asset Info
    │       └── Actions (Edit/Delete)
    └── Pagination
```

---

## 📐 Type Definitions (Detailed)

### asset.ts Structure

```typescript
// ── Raw API Types ─────────────────────────────────────────────

export type AssetType = 'logo' | 'favicon' | 'banner' | 'other';

export interface StoreAsset {
  id: number;
  store_id: number;
  file_path: string;
  file_url: string;
  file_name: string;
  file_size: number; // in bytes
  mime_type: string;
  asset_type: AssetType;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
}

// ── View Types ────────────────────────────────────────────────

export interface StoreAssetView {
  id: number;
  storeId: number;
  filePath: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  assetType: AssetType;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Form Types ────────────────────────────────────────────────

export interface UploadAssetPayload {
  file: File;
  asset_type: AssetType;
  alt_text?: string;
}

export interface UpdateAssetPayload {
  alt_text?: string;
  asset_type?: AssetType;
}

// ── Filter Types ──────────────────────────────────────────────

export interface AssetFilters {
  page: number;
  perPage: number;
  asset_type?: AssetType | 'all';
}
```

---

## 🔌 API Client Functions (Detailed)

### assets.ts Implementation

```typescript
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
  if (filters.perPage !== 24) params.per_page = filters.perPage;
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
    API_ROUTES.store(storeId).assets().create(),
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
 * Update asset metadata.
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
  await clientApi.delete(
    API_ROUTES.store(storeId).assets().delete(assetId),
  );
}
```

---

## 🪝 React Query Hooks (Detailed)

### useAssets.ts

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getAssets } from '@/lib/api/assets';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapStoreAsset } from '@/lib/mappers/asset';
import { selectPaginatedList } from '@/lib/mappers/pagination';
import type {
  StoreAsset,
  StoreAssetView,
  AssetFilters,
} from '@/types/asset';
import type { PaginatedResponse, ApiError } from '@/types/api';

const DEFAULT_FILTERS: AssetFilters = {
  page: 1,
  perPage: 24,
};

export function useAssets(
  storeId: string,
  filters: AssetFilters = DEFAULT_FILTERS,
) {
  return useQuery<
    PaginatedResponse<StoreAsset>,
    ApiError,
    PaginatedResponse<StoreAssetView>
  >({
    queryKey: queryKeys.assets(storeId).list(
      filters as unknown as Record<string, unknown>,
    ),
    queryFn: () => getAssets(storeId, filters),
    staleTime: QUERY_CONFIG.staleTime,
    select: selectPaginatedList(mapStoreAsset),
  });
}
```

### useAssetMutations.ts

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadAsset,
  updateAsset,
  deleteAsset,
} from '@/lib/api/assets';
import { queryKeys } from '@/lib/queryKeys';
import type {
  UploadAssetPayload,
  UpdateAssetPayload,
} from '@/types/asset';
import type { ApiError } from '@/types/api';

export function useUploadAsset(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    ApiError,
    UploadAssetPayload
  >({
    mutationFn: (payload) => uploadAsset(storeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets(storeId).lists(),
      });
    },
  });
}

export function useUpdateAsset(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    ApiError,
    { assetId: string; payload: UpdateAssetPayload }
  >({
    mutationFn: ({ assetId, payload }) =>
      updateAsset(storeId, assetId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets(storeId).all(),
      });
    },
  });
}

export function useDeleteAsset(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiError,
    string
  >({
    mutationFn: (assetId) => deleteAsset(storeId, assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets(storeId).all(),
      });
    },
  });
}
```

---

## 🧩 Component Implementation Details

### AssetUploader.tsx Specification

**Purpose**: Drag-and-drop file uploader with preview

**Props**:
```typescript
interface AssetUploaderProps {
  storeId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultAssetType?: AssetType;
}
```

**Features**:
- Drag-and-drop zone with visual feedback
- Click to open file picker
- Multiple file upload support
- File type validation (images only)
- File size validation (max 5MB)
- Image preview thumbnails
- Upload progress indicator
- Alt text input per file
- Asset type selector per file
- Batch upload

**Implementation Notes**:
- Use HTML5 drag events
- Use FileReader API for preview
- Show progress with toast notifications
- Validate before upload
- Handle errors gracefully

---

### LogoFaviconUploader.tsx Specification

**Purpose**: Dedicated uploader for store logo and favicon

**Props**:
```typescript
interface LogoFaviconUploaderProps {
  storeId: string;
  type: 'logo' | 'favicon';
  currentUrl?: string | null;
  onUploadSuccess?: (url: string) => void;
}
```

**Features**:
- Single file only
- Show current logo/favicon
- Replace with new file
- Image preview before upload
- Recommended dimensions hint
- Automatic asset type selection
- Updates stores table directly

**Implementation Notes**:
- Upload with asset_type='logo' or 'favicon'
- After upload, update store's logo_url or favicon_url
- Use separate mutation for store update
- Show success/error toast

---

## 🎨 UI/UX Specifications

### Asset Grid Layout

**Desktop** (lg+):
- 6 columns grid
- 200px card width
- 16px gap

**Tablet** (md):
- 4 columns grid
- Responsive card width
- 12px gap

**Mobile** (sm):
- 2 columns grid
- Full width cards
- 8px gap

### Asset Card Design

**Structure**:
```
┌─────────────────────┐
│                     │
│   Image Thumbnail   │  ← 200x200 aspect-square
│                     │
├─────────────────────┤
│ filename.jpg        │
│ 🏷️ logo  📏 2.4 MB │
│ Alt: Homepage logo  │
├─────────────────────┤
│  [Edit] [Delete]    │
└─────────────────────┘
```

### Empty State

**When no assets**:
- Illustration or icon
- "No assets yet" heading
- "Upload your first asset to get started" description
- "Upload Asset" CTA button

---

## 🌍 Translations Required

### Add to `locales/en/common.json`

```json
{
  "theme": {
    "assets": {
      "title": "Asset Library",
      "subtitle": "Manage images, logos, and other media files",
      "uploadAsset": "Upload Asset",
      "uploadFiles": "Upload Files",
      "dragAndDrop": "Drag and drop files here, or click to browse",
      "fileTypes": "Supported: JPG, PNG, GIF, WebP (max 5MB)",
      "logoUploader": {
        "title": "Store Logo",
        "description": "Upload your store logo (recommended: 400x100px)",
        "replace": "Replace Logo",
        "remove": "Remove Logo"
      },
      "faviconUploader": {
        "title": "Favicon",
        "description": "Upload your favicon (recommended: 32x32px)",
        "replace": "Replace Favicon",
        "remove": "Remove Favicon"
      },
      "filters": {
        "all": "All Assets",
        "logo": "Logos",
        "favicon": "Favicons",
        "banner": "Banners",
        "other": "Other"
      },
      "assetCard": {
        "edit": "Edit",
        "delete": "Delete",
        "altText": "Alt text"
      },
      "editDialog": {
        "title": "Edit Asset",
        "altTextLabel": "Alt Text",
        "altTextPlaceholder": "Describe this image",
        "assetTypeLabel": "Asset Type",
        "save": "Save Changes",
        "cancel": "Cancel"
      },
      "deleteConfirm": "Are you sure you want to delete this asset? This action cannot be undone.",
      "uploadSuccess": "Asset uploaded successfully",
      "uploadError": "Failed to upload asset",
      "updateSuccess": "Asset updated successfully",
      "updateError": "Failed to update asset",
      "deleteSuccess": "Asset deleted successfully",
      "deleteError": "Failed to delete asset",
      "emptyState": {
        "title": "No assets yet",
        "description": "Upload your first image to get started"
      }
    }
  }
}
```

---

## 🔧 Configuration Updates

### Update `config/routes.ts`

Add to API_ROUTES:
```typescript
store: (storeId: string) => ({
  // ... existing routes ...
  assets: () => ({
    list:    () => `/api/v1/merchant/stores/${storeId}/assets`,
    create:  () => `/api/v1/merchant/stores/${storeId}/assets`,
    detail:  (assetId: string) =>
      `/api/v1/merchant/stores/${storeId}/assets/${assetId}`,
    update:  (assetId: string) =>
      `/api/v1/merchant/stores/${storeId}/assets/${assetId}`,
    delete:  (assetId: string) =>
      `/api/v1/merchant/stores/${storeId}/assets/${assetId}`,
  }),
}),
```

### Update `lib/queryKeys.ts`

Add to queryKeys:
```typescript
assets: (storeId: string) => ({
  all:    () => ['merchant', storeId, 'assets'] as const,
  lists:  () => ['merchant', storeId, 'assets', 'list'] as const,
  list:   (filters: Record<string, unknown> = {}) =>
    ['merchant', storeId, 'assets', 'list', filters] as const,
  detail: (assetId: string) =>
    ['merchant', storeId, 'assets', 'detail', assetId] as const,
}),
```

---

## ✅ Implementation Checklist

### Phase 1: Foundation (30 min)
- [ ] Create `types/asset.ts`
- [ ] Create `lib/api/assets.ts`
- [ ] Create `lib/mappers/asset.ts`
- [ ] Update `config/routes.ts`
- [ ] Update `lib/queryKeys.ts`
- [ ] Add translations to `locales/en/common.json`

### Phase 2: Hooks (30 min)
- [ ] Create `hooks/assets/useAssets.ts`
- [ ] Create `hooks/assets/useAssetMutations.ts`
- [ ] Test hooks in isolation

### Phase 3: Components (90 min)
- [ ] Create `AssetCard.tsx` (20 min)
- [ ] Create `AssetGrid.tsx` (15 min)
- [ ] Create `AssetUploader.tsx` (30 min)
- [ ] Create `LogoFaviconUploader.tsx` (25 min)

### Phase 4: Page Integration (45 min)
- [ ] Create `page.tsx`
- [ ] Create `AssetLibraryContent.tsx`
- [ ] Wire up all components
- [ ] Add filters and pagination

### Phase 5: Testing & Polish (45 min)
- [ ] Test upload flow
- [ ] Test edit flow
- [ ] Test delete flow
- [ ] Test logo/favicon upload
- [ ] Test mobile responsiveness
- [ ] Test error handling
- [ ] Test loading states
- [ ] Verify accessibility

---

## 🧪 Testing Strategy

### Manual Testing Checklist

#### Upload Flow
- [ ] Drag and drop single file
- [ ] Drag and drop multiple files
- [ ] Click to browse and select file
- [ ] Validate file type (reject .pdf)
- [ ] Validate file size (reject >5MB)
- [ ] Preview thumbnail appears
- [ ] Progress indicator shows
- [ ] Success toast appears
- [ ] Grid refreshes with new asset

#### Edit Flow
- [ ] Click edit on asset
- [ ] Dialog opens with current data
- [ ] Update alt text
- [ ] Change asset type
- [ ] Save changes
- [ ] Success toast appears
- [ ] Card updates immediately

#### Delete Flow
- [ ] Click delete on asset
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Success toast appears
- [ ] Asset removed from grid
- [ ] Cancel deletion works

#### Logo/Favicon Upload
- [ ] Upload new logo
- [ ] Logo appears in uploader
- [ ] Logo appears in header (verify)
- [ ] Replace existing logo
- [ ] Upload favicon
- [ ] Verify favicon in browser tab

#### Responsive Design
- [ ] Desktop layout (6 columns)
- [ ] Tablet layout (4 columns)
- [ ] Mobile layout (2 columns)
- [ ] Drag-and-drop works on touch devices
- [ ] Dialogs are mobile-friendly

---

## 📏 Success Criteria

### Functional Requirements
- ✅ Asset library page displays all uploaded assets
- ✅ File upload works (drag-and-drop + click)
- ✅ Image preview shows before upload
- ✅ Asset types properly categorized
- ✅ Logo/favicon upload updates store settings
- ✅ Delete confirmation works
- ✅ Alt text can be added/edited
- ✅ Pagination works
- ✅ Filters work (by asset type)

### Technical Requirements
- ✅ 100% architecture compliance
- ✅ Type-safe throughout
- ✅ Loading states work
- ✅ Error handling works
- ✅ Mobile responsive
- ✅ Translations complete
- ✅ Query keys centralized
- ✅ Follows SESSION 10 patterns

---

## 🚀 Implementation Order

### Step 1: Setup (File Creation)
1. Create all type files
2. Create all API files
3. Create all mapper files
4. Update configuration files
5. Add translations

### Step 2: Hooks
1. Implement useAssets
2. Implement useAssetMutations
3. Test hooks work

### Step 3: Components (Bottom-Up)
1. AssetCard (leaf component)
2. AssetGrid (uses AssetCard)
3. AssetUploader (standalone)
4. LogoFaviconUploader (standalone)
5. AssetLibraryContent (orchestrator)

### Step 4: Page
1. Create page.tsx
2. Wire up AssetLibraryContent
3. Test full flow

### Step 5: Polish
1. Add loading skeletons
2. Improve error messages
3. Test edge cases
4. Mobile testing

---

## 📚 Reference Documents

**Must Read Before Implementation**:
1. SESSION_10_COMPLETE.md - Reference pattern
2. THEME_SYSTEM_SESSION_PLAN.md (lines 552-622) - Original spec
3. laratenant-backend/docs/ARCHITECTURE.md - Architecture rules
4. laratenant-commerce/TECHNICAL_REQUIREMENTS.md - Technical guidelines

**Code References**:
1. Navigation Builder: `src/features/theme/navigation/`
2. Hero Banners: `src/features/merchant/hero-banners/` (has image upload)
3. Brands: `src/features/dashboard/brands/`

---

## 🎯 Expected Outcomes

After SESSION 11 completion:

### Deliverables
- ✅ 11 new files created
- ✅ ~1,800 lines of code
- ✅ Complete asset management UI
- ✅ Working file upload
- ✅ Logo/favicon management

### Progress
- ✅ 2 of 3 frontend sessions complete
- ✅ 11 of 12 total sessions complete
- ✅ 92% project completion
- ⏳ Only SESSION 12 remaining

### Quality
- ✅ Production-ready code
- ✅ 100% architecture compliance
- ✅ Full test coverage
- ✅ Responsive design
- ✅ Accessibility compliant

---

## 🔜 Next Steps After Completion

1. **Immediate**: Test all functionality
2. **Short-term**: Create SESSION_11_COMPLETE.md
3. **Medium-term**: Start SESSION 12 (Theme Overview & Settings)
4. **Long-term**: Complete theme system (100%)

---

**PREPARATION COMPLETE** ✅  
**READY FOR IMPLEMENTATION** 🚀

---

**Date**: June 6, 2026  
**Prepared By**: Kiro AI Assistant  
**Review Status**: Ready for Implementation
