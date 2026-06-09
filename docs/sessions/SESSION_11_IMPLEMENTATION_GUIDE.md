# SESSION 11: Asset Library & Logo Uploader - Implementation Guide

**Status**: 📝 Ready to Execute  
**Estimated Duration**: 3-4 hours  
**Date**: June 6, 2026

---

## 🚀 Quick Start

To begin SESSION 11, simply say:

```
Hi, start implementing SESSION 11 following SESSION_11_PREPARATION.md
```

Or more directly:

```
Hi, run SESSION 11 from THEME_SYSTEM_SESSION_PLAN.md
```

---

## 📋 Pre-Implementation Checklist

Before starting, verify:

- ✅ SESSION 10 is complete
- ✅ Backend API endpoints are working
- ✅ Development server can be started
- ✅ No uncommitted changes (clean git state recommended)
- ✅ Read SESSION_11_PREPARATION.md thoroughly

---

## 🗺️ Implementation Roadmap

### Phase 1: Foundation Layer (30 minutes)

**Goal**: Set up types, API client, mappers, and configuration

**Files to Create**:
1. `src/types/asset.ts` (100 lines)
2. `src/lib/api/assets.ts` (120 lines)
3. `src/lib/mappers/asset.ts` (40 lines)

**Files to Update**:
1. `src/config/routes.ts` (+20 lines)
2. `src/lib/queryKeys.ts` (+10 lines)
3. `src/locales/en/common.json` (+80 lines)

**Verification**:
```bash
# Type check
npm run type-check

# Verify no errors
```

---

### Phase 2: React Query Hooks (30 minutes)

**Goal**: Create server state management hooks

**Files to Create**:
1. `src/hooks/assets/useAssets.ts` (50 lines)
2. `src/hooks/assets/useAssetMutations.ts` (80 lines)

**Verification**:
```typescript
// Test in a temporary component
import { useAssets } from '@/hooks/assets/useAssets';

const storeId = "1";
const { data, isLoading } = useAssets(storeId, { page: 1, perPage: 24 });
```

---

### Phase 3: UI Components (90 minutes)

**Goal**: Build all UI components bottom-up

#### Step 3A: AssetCard Component (20 min)
**File**: `src/features/theme/assets/AssetCard.tsx` (~150 lines)

**Features**:
- Image thumbnail display
- Asset metadata (name, size, type)
- Alt text display
- Edit/Delete actions
- Loading state
- Error state

**Dependencies**: shadcn/ui components (Card, Button, Badge)

#### Step 3B: AssetGrid Component (15 min)
**File**: `src/features/theme/assets/AssetGrid.tsx` (~80 lines)

**Features**:
- Responsive grid layout
- Empty state
- Loading skeleton
- Maps assets to AssetCard

#### Step 3C: AssetUploader Component (30 min)
**File**: `src/features/theme/assets/AssetUploader.tsx` (~200 lines)

**Features**:
- Drag-and-drop zone
- File input fallback
- Multiple file preview
- Upload progress
- Validation
- Error handling

**Key Implementation Details**:
```typescript
// Drag events
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(true);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  const files = Array.from(e.dataTransfer.files);
  handleFiles(files);
};

// File validation
const validateFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    return 'Only image files are allowed';
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'File size must be less than 5MB';
  }
  return null;
};

// Preview with FileReader
const generatePreview = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    setPreview(e.target?.result as string);
  };
  reader.readAsDataURL(file);
};
```

#### Step 3D: LogoFaviconUploader Component (25 min)
**File**: `src/features/theme/assets/LogoFaviconUploader.tsx` (~180 lines)

**Features**:
- Single file upload
- Current logo/favicon display
- Replace functionality
- Dimension recommendations
- Direct store update

**Key Difference from AssetUploader**:
- Single file only (no multiple)
- Auto-selects asset_type
- Updates stores table after upload
- Shows current value from bootstrapStore

---

### Phase 4: Page Integration (45 minutes)

**Goal**: Wire everything together in the main page

#### Step 4A: AssetLibraryContent Component (25 min)
**File**: `src/features/theme/assets/AssetLibraryContent.tsx` (~250 lines)

**Features**:
- Header with title & upload button
- Logo/Favicon uploader section
- Asset type filter
- Asset grid display
- Pagination controls
- Upload dialog
- Edit dialog
- Delete confirmation

**State Management**:
```typescript
// URL state for filters
const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
const [assetType, setAssetType] = useQueryState('type', parseAsString.withDefault('all'));

// Modal states
const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
const [editingAsset, setEditingAsset] = useState<StoreAssetView | null>(null);
```

#### Step 4B: Page Component (10 min)
**File**: `src/app/[locale]/(merchant)/merchant/theme/assets/page.tsx` (~60 lines)

**Features**:
- Server Component
- Metadata configuration
- Store context resolution
- Initial filters from searchParams
- Render AssetLibraryContent

#### Step 4C: Edit Asset Dialog (10 min)
**File**: `src/features/theme/assets/EditAssetDialog.tsx` (~120 lines)

**Features**:
- Form with alt text input
- Asset type selector
- Save/Cancel actions
- Validation
- Loading state

---

### Phase 5: Testing & Polish (45 minutes)

**Goal**: Verify everything works and polish UX

#### Manual Testing (30 min)
Use the checklist from SESSION_11_PREPARATION.md:
- Upload flow (drag-and-drop, click)
- Edit flow (update alt text)
- Delete flow (confirmation)
- Logo/favicon upload
- Responsive design
- Error handling

#### Polish (15 min)
- Add loading skeletons
- Improve error messages
- Add helpful empty states
- Test on mobile device
- Verify accessibility

---

## 🎯 Key Implementation Patterns

### Pattern 1: File Upload with FormData

```typescript
const uploadMutation = useUploadAsset(storeId);

const handleUpload = async (file: File, assetType: AssetType, altText?: string) => {
  const payload: UploadAssetPayload = {
    file,
    asset_type: assetType,
    alt_text: altText,
  };

  try {
    await uploadMutation.mutateAsync(payload);
    toast.success(t('uploadSuccess'));
    setIsUploadDialogOpen(false);
  } catch (error: any) {
    toast.error(error?.message ?? t('uploadError'));
  }
};
```

### Pattern 2: Image Preview

```typescript
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

useEffect(() => {
  if (!file) {
    setPreviewUrl(null);
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setPreviewUrl(reader.result as string);
  };
  reader.readAsDataURL(file);

  return () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };
}, [file]);
```

### Pattern 3: Drag-and-Drop

```typescript
<div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  className={cn(
    'border-2 border-dashed rounded-lg p-8 text-center',
    isDragging ? 'border-primary bg-primary/5' : 'border-border',
  )}
>
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    multiple
    className="hidden"
    onChange={(e) => {
      if (e.target.files) {
        handleFiles(Array.from(e.target.files));
      }
    }}
  />
  <Button onClick={() => fileInputRef.current?.click()}>
    Browse Files
  </Button>
</div>
```

---

## 🧩 Component Props Reference

### AssetCard

```typescript
interface AssetCardProps {
  asset: StoreAssetView;
  onEdit: (asset: StoreAssetView) => void;
  onDelete: (assetId: number) => void;
}
```

### AssetGrid

```typescript
interface AssetGridProps {
  assets: StoreAssetView[];
  isLoading: boolean;
  onEdit: (asset: StoreAssetView) => void;
  onDelete: (assetId: number) => void;
}
```

### AssetUploader

```typescript
interface AssetUploaderProps {
  storeId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultAssetType?: AssetType;
}
```

### LogoFaviconUploader

```typescript
interface LogoFaviconUploaderProps {
  storeId: string;
  type: 'logo' | 'favicon';
  currentUrl?: string | null;
  onUploadSuccess?: (url: string) => void;
}
```

### AssetLibraryContent

```typescript
interface AssetLibraryContentProps {
  storeId: string;
  initialFilters: AssetFilters;
  currentLogo?: string | null;
  currentFavicon?: string | null;
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error on File Upload
**Symptom**: Network error when uploading file  
**Solution**: Ensure Content-Type is 'multipart/form-data' and CSRF token is included

### Issue 2: Preview Not Showing
**Symptom**: Image preview doesn't appear  
**Solution**: Check FileReader is properly instantiated and result is set to state

### Issue 3: Query Not Invalidating
**Symptom**: Grid doesn't refresh after upload  
**Solution**: Ensure queryClient.invalidateQueries uses correct query key

### Issue 4: File Size Shows Wrong
**Symptom**: File size displays incorrectly  
**Solution**: Backend returns bytes, format with helper:
```typescript
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
```

### Issue 5: Drag-and-Drop Not Working on Mobile
**Symptom**: Can't drag files on touch devices  
**Solution**: Add touch event handlers or use file input fallback

---

## 📊 Progress Tracking

Use this checklist to track implementation progress:

### Foundation
- [ ] types/asset.ts created
- [ ] lib/api/assets.ts created
- [ ] lib/mappers/asset.ts created
- [ ] config/routes.ts updated
- [ ] lib/queryKeys.ts updated
- [ ] locales/en/common.json updated

### Hooks
- [ ] hooks/assets/useAssets.ts created
- [ ] hooks/assets/useAssetMutations.ts created

### Components
- [ ] AssetCard.tsx created
- [ ] AssetGrid.tsx created
- [ ] AssetUploader.tsx created
- [ ] LogoFaviconUploader.tsx created
- [ ] EditAssetDialog.tsx created
- [ ] AssetLibraryContent.tsx created

### Page
- [ ] page.tsx created

### Testing
- [ ] Upload flow tested
- [ ] Edit flow tested
- [ ] Delete flow tested
- [ ] Logo/favicon upload tested
- [ ] Mobile responsive verified
- [ ] Error handling verified

---

## ✅ Exit Criteria

Before marking SESSION 11 as complete, verify:

- ✅ All 11 files created
- ✅ No TypeScript errors
- ✅ All translations added
- ✅ Upload works (drag-and-drop + click)
- ✅ Edit works (alt text, asset type)
- ✅ Delete works (with confirmation)
- ✅ Logo/favicon upload works
- ✅ Grid displays correctly
- ✅ Pagination works
- ✅ Filters work
- ✅ Mobile responsive
- ✅ Loading states work
- ✅ Error handling works
- ✅ Architecture compliant

---

## 📝 Post-Implementation Tasks

After completing the implementation:

1. **Create Completion Document**
   ```
   Create SESSION_11_COMPLETE.md following the pattern of SESSION_10_COMPLETE.md
   ```

2. **Git Commit**
   ```bash
   git add .
   git commit -m "feat(theme): implement asset library and logo uploader (SESSION 11)
   
   - Add asset library page with grid view
   - Implement drag-and-drop file upload
   - Add logo/favicon uploader components
   - Support alt text for accessibility
   - Add asset management (edit/delete)
   - Mobile responsive design
   
   Files: 11 files, ~1,800 LOC
   Status: SESSION 11 complete, 11/12 sessions done"
   ```

3. **Update Progress Tracking**
   - Update THEME_SYSTEM_PROGRESS_UPDATE.md
   - Mark SESSION 11 as complete
   - Calculate new progress percentage

4. **Prepare for SESSION 12**
   - Read THEME_SYSTEM_SESSION_PLAN.md (lines 624-698)
   - Review SESSION 12 objectives
   - Create SESSION_12_PREPARATION.md

---

## 🎯 Success Metrics

### Quantitative
- **Files Created**: 11
- **Lines of Code**: ~1,800
- **Components**: 6
- **Hooks**: 3
- **API Functions**: 4
- **Translations**: 30+

### Qualitative
- **Architecture Compliance**: 100%
- **Type Safety**: 100%
- **Test Coverage**: Manual testing complete
- **Responsive Design**: Mobile-friendly
- **User Experience**: Intuitive and polished

---

## 🚀 Ready to Start?

Simply say:

```
Hi, implement SESSION 11 following the preparation document
```

Or use the shorthand:

```
Start SESSION 11
```

I'll begin with Phase 1 (Foundation Layer) and work through all phases systematically, creating production-ready code that follows all established patterns from SESSION 10.

---

**Good luck with the implementation!** 🎉

---

**Document Version**: 1.0  
**Created**: June 6, 2026  
**Last Updated**: June 6, 2026  
**Status**: Ready for Execution
