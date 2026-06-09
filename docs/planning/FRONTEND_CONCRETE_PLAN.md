# Frontend Implementation - Concrete Action Plan

## 📊 Investigation Complete

### ✅ Backend Status
- **100% Complete** - Routes, controllers, actions, DTOs, validation all ready
- Endpoints available:
  - `POST /api/v1/merchant/stores/{store}/media/upload`
  - `DELETE /api/v1/merchant/stores/{store}/media/delete`

### ✅ Frontend Discovery

**Project Structure:**
- `justshop-frontend` (Vue/Nuxt) → **Merchant Dashboard (Hero Banners only)**
- `laratenant-commerce` (React/Next) → **Main Dashboard (Products, Brands, etc.)**

**Current Implementation:**
- ✅ Hero Banners: Using ImageUploader.vue (Vue) - already file upload
- ❌ Products: Using URL text input (React) - **NEEDS MIGRATION**
- ❌ Brands: Using URL text input (React) - **NEEDS MIGRATION**

---

## 🎯 Primary Frontend: React (`laratenant-commerce`)

The main merchant dashboard with products and brands is in the **React/Next.js** project.

### Key Files Identified:

**Products:**
- `src/features/products/editor/components/ProductImagesManager.tsx` ← **MAIN TARGET**
- `src/features/products/editor/components/VariantMediaDialog.tsx` ← **SECONDARY TARGET**
- `src/features/products/editor/tabs/MediaTab.tsx`
- `src/features/products/editor/components/EditProductForm.tsx`
- `src/features/dashboard/products/CreateProductForm.tsx`

**Brands:**
- `src/features/dashboard/brands/CreateBrandForm.tsx` ← **TARGET**
- `src/features/dashboard/brands/EditBrandForm.tsx` ← **TARGET**

---

## 📋 Implementation Plan

### **Phase 1: Create React Generic Image Uploader** (NEW WORK)

Since the React project doesn't have a generic uploader, we need to create one.

#### 1.1. Create Component Structure

```
laratenant-commerce/src/
├── components/media/
│   └── GenericImageUploader.tsx (NEW)
├── lib/api/
│   └── media.ts (NEW)
└── types/
    └── media.ts (NEW)
```

#### 1.2. Component Features

**Must implement:**
- ✅ Drag & drop support
- ✅ Click to upload (file picker)
- ✅ Progress indicator
- ✅ Image preview
- ✅ Delete button
- ✅ Client-side validation
- ✅ Error handling
- ✅ Support for contexts (products, brands, variants, etc.)

**Props:**
```typescript
interface GenericImageUploaderProps {
  value: string;           // image path or URL
  onChange: (path: string) => void;
  context: 'products' | 'variants' | 'brands' | 'categories' | 'hero' | 'tags' | 'stores';
  storeId: string;
  label?: string;
  disabled?: boolean;
}
```

---

### **Phase 2: Products Migration**

#### 2.1. Replace ProductImagesManager

**Current Implementation:**
```tsx
// URL text input
<Input
  value={urlDraft}
  onChange={(e) => setUrlDraft(e.target.value)}
  placeholder="https://example.com/image.jpg"
/>
```

**New Implementation:**
```tsx
// File uploader
<GenericImageUploader
  value={urlDraft}
  onChange={setUrlDraft}
  context="products"
  storeId={storeId}
/>
```

#### 2.2. Update Variant Image Dialog

**File:** `VariantMediaDialog.tsx`

Replace URL input with uploader for variant-specific images.

**Context:** `variants`

#### 2.3. Testing

- [ ] Create product with images
- [ ] Edit product images
- [ ] Delete product images
- [ ] Add multiple images
- [ ] Reorder images (if supported)
- [ ] Test with variants

---

### **Phase 3: Brands Migration**

#### 3.1. Update Brand Forms

**Files:**
- `CreateBrandForm.tsx`
- `EditBrandForm.tsx`

**Current:**
```tsx
<Input
  name="logo_url"
  type="url"
  placeholder="https://example.com/logo.jpg"
/>
```

**New:**
```tsx
<GenericImageUploader
  value={form.logo_path}
  onChange={(path) => form.setFieldValue('logo_path', path)}
  context="brands"
  storeId={storeId}
  label="Brand Logo"
/>
```

#### 3.2. Backend Field Update

Change from `logo_url` to `logo_path` (if not already done):

```php
// CreateBrandRequest.php
'logo_path' => ['sometimes', 'nullable', 'string', 'max:500'],
```

#### 3.3. Testing

- [ ] Create brand with logo
- [ ] Edit brand logo
- [ ] Delete brand logo
- [ ] Verify backward compatibility

---

### **Phase 4: Categories/Tags/Stores (Optional)**

Only if product owner wants these features.

---

## 🛠️ Detailed Implementation Steps

### Step 1: Create API Client (React)

**File:** `laratenant-commerce/src/lib/api/media.ts`

```typescript
export type MediaContext = 'products' | 'variants' | 'brands' | 'categories' | 'hero' | 'tags' | 'stores';

export interface UploadResponse {
  status: boolean;
  data: {
    path: string;
    url: string;
    full_url: string;
  };
  message: string;
}

export async function uploadImage(
  storeId: string,
  context: MediaContext,
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('context', context);
  formData.append('image', file);

  const response = await fetch(
    `/api/v1/merchant/stores/${storeId}/media/upload`,
    {
      method: 'POST',
      body: formData,
      headers: {
        // Include auth token
      },
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}

export async function deleteImage(
  storeId: string,
  context: MediaContext,
  path: string
): Promise<void> {
  await fetch(`/api/v1/merchant/stores/${storeId}/media/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // Include auth token
    },
    body: JSON.stringify({ context, path }),
  });
}
```

### Step 2: Create Types

**File:** `laratenant-commerce/src/types/media.ts`

```typescript
export type MediaContext = 
  | 'products' 
  | 'variants' 
  | 'brands' 
  | 'categories' 
  | 'hero' 
  | 'tags' 
  | 'stores';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
```

### Step 3: Create Generic Uploader Component

**File:** `laratenant-commerce/src/components/media/GenericImageUploader.tsx`

Key features to implement:
- React hooks for state management
- File validation (type, size)
- Upload progress tracking
- Image preview
- Delete confirmation
- Error handling
- Drag & drop event handlers
- Accessibility (ARIA labels, keyboard support)

### Step 4: Update ProductImagesManager

**File:** `src/features/products/editor/components/ProductImagesManager.tsx`

**Changes:**
1. Import `GenericImageUploader`
2. Replace URL input section with uploader
3. Keep all other functionality (reorder, alt text, etc.)
4. Update handler functions if needed

### Step 5: Update VariantMediaDialog

**File:** `src/features/products/editor/components/VariantMediaDialog.tsx`

Similar changes for variant images.

### Step 6: Update Brand Forms

**Files:**
- `src/features/dashboard/brands/CreateBrandForm.tsx`
- `src/features/dashboard/brands/EditBrandForm.tsx`

Replace logo URL input with uploader.

### Step 7: Testing & Validation

Run through all test cases for each feature.

---

## 🔧 Technical Considerations

### Authentication
The React app needs to include auth tokens in API calls:

```typescript
const token = getAuthToken(); // From your auth context/store

headers: {
  'Authorization': `Bearer ${token}`,
}
```

### Error Handling

```typescript
try {
  await uploadImage(storeId, context, file);
} catch (error) {
  if (error.response?.status === 422) {
    // Validation error
    showValidationErrors(error.response.data.errors);
  } else if (error.response?.status === 413) {
    // File too large
    toast.error('File is too large (max 5MB)');
  } else {
    // Generic error
    toast.error('Upload failed. Please try again.');
  }
}
```

### Loading States

```typescript
const [uploading, setUploading] = useState(false);
const [progress, setProgress] = useState(0);

// Show loading indicator during upload
if (uploading) {
  return <LoadingSpinner />;
}
```

### Optimistic UI Updates

For better UX, show preview immediately:

```typescript
const handleFileSelect = (file: File) => {
  // Show preview immediately
  const previewUrl = URL.createObjectURL(file);
  setPreview(previewUrl);
  
  // Upload in background
  uploadFile(file);
};
```

---

## 📊 Migration Timeline

### Conservative (1 Week):

**Day 1-2:**
- Create React `GenericImageUploader` component
- Create API client functions
- Create types
- Test uploader in isolation

**Day 3-4:**
- Migrate Products (ProductImagesManager)
- Migrate Variants (VariantMediaDialog)
- Test product workflows

**Day 5:**
- Migrate Brands
- Test brand workflows

**Day 6:**
- End-to-end testing
- Bug fixes

**Day 7:**
- Final review
- Deploy to staging
- Production deployment

### Aggressive (3 Days):

**Day 1:**
- Create Generic Uploader + API client
- Start Products migration

**Day 2:**
- Complete Products migration
- Start Brands migration
- Testing

**Day 3:**
- Complete Brands migration
- Final testing
- Deploy

---

## ✅ Success Criteria

### Functional:
- [ ] Can upload images via drag & drop
- [ ] Can upload images via click
- [ ] Progress indicator works
- [ ] Image preview displays correctly
- [ ] Can delete uploaded images
- [ ] Validation errors show clearly
- [ ] Backward compatible with URL images

### Performance:
- [ ] Upload completes in < 5 seconds (for 5MB file)
- [ ] No UI freezing during upload
- [ ] Preview renders immediately

### UX:
- [ ] Intuitive interface
- [ ] Clear error messages
- [ ] Visual feedback on all actions
- [ ] Mobile-responsive

---

## 🚨 Potential Issues & Solutions

### Issue 1: CORS Errors
**Solution:** Ensure backend CORS config allows file uploads

### Issue 2: Token Not Sent
**Solution:** Configure fetch to include credentials

### Issue 3: File Size Limit on Server
**Solution:** Check nginx/Apache config (`client_max_body_size`)

### Issue 4: Preview Not Showing
**Solution:** Verify storage symlink exists: `php artisan storage:link`

---

## 📦 Deliverables

1. **New Files:**
   - `GenericImageUploader.tsx`
   - `lib/api/media.ts`
   - `types/media.ts`

2. **Modified Files:**
   - `ProductImagesManager.tsx`
   - `VariantMediaDialog.tsx`
   - `CreateBrandForm.tsx`
   - `EditBrandForm.tsx`

3. **Documentation:**
   - Component usage guide
   - API documentation
   - Migration guide for other features

4. **Tests (if applicable):**
   - Unit tests for uploader component
   - Integration tests for upload flow

---

## 🎯 Current State Summary

✅ **Backend:** 100% Complete
✅ **Vue Frontend (Hero Banners):** 100% Complete
🔜 **React Frontend (Products/Brands):** Ready to implement

**Estimated Effort:**
- Creating Generic Uploader: 4-6 hours
- Products Migration: 3-4 hours
- Brands Migration: 2-3 hours
- Testing: 3-4 hours
- **Total: 12-17 hours** (1.5 to 2 days for one developer)

---

## 🚀 Ready to Start!

**Next immediate action:**
Create the React `GenericImageUploader.tsx` component based on the Vue implementation, adapted for React/Next.js patterns.

Should I proceed with creating the React component now?
