# Hero Banner Image Upload Feature

## Problem
Users had to manually type image file paths (e.g., `hero/banner.jpg`) instead of uploading images through a proper file upload interface. This was bad UX and error-prone.

## Solution Implemented
Created a complete file upload system with:
- Drag & drop support
- File validation (type, size)
- Upload progress indicator
- Image preview
- Delete functionality

## Backend Implementation

### 1. File Upload Controller
**File**: `laratenant-backend/app/Http/Controllers/Api/Merchant/AdminFileUploadController.php`

Features:
- ✅ Upload hero banner images (POST `/api/v1/merchant/stores/{store}/hero-banners/upload-image`)
- ✅ Delete hero banner images (DELETE `/api/v1/merchant/stores/{store}/hero-banners/delete-image`)
- ✅ Validation: Image types (jpeg, jpg, png, gif, webp), max 5MB
- ✅ Security: Path validation to prevent directory traversal
- ✅ Unique filename generation
- ✅ Stores in `storage/app/public/hero/` directory

### 2. Routes Added
**File**: `laratenant-backend/routes/api/v1/merchant/admin.php`

```php
Route::post('/upload-image', [AdminFileUploadController::class, 'uploadHeroBannerImage'])
    ->name('hero-banners.upload-image');

Route::delete('/delete-image', [AdminFileUploadController::class, 'deleteHeroBannerImage'])
    ->name('hero-banners.delete-image');
```

### 3. API Response Format

**Upload Response**:
```json
{
  "success": true,
  "data": {
    "path": "hero/abc123xyz.jpg",
    "url": "/storage/hero/abc123xyz.jpg",
    "full_url": "http://localhost:8000/storage/hero/abc123xyz.jpg"
  }
}
```

**Delete Response**:
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Frontend Implementation

### 1. ImageUploader Component
**File**: `justshop-frontend/app/components/merchant/hero-banners/ImageUploader.vue`

Features:
- ✅ **Drag & Drop**: Drop images directly onto upload area
- ✅ **Click to Upload**: Traditional file picker
- ✅ **File Validation**: 
  - Accepted formats: JPG, PNG, GIF, WEBP
  - Max size: 5MB
  - Instant client-side validation
- ✅ **Upload Progress**: Visual progress bar with percentage
- ✅ **Image Preview**: Shows uploaded image with path
- ✅ **Delete Button**: Remove image with confirmation
- ✅ **Error Handling**: User-friendly error messages

### 2. Updated Components

**VisualTypeSelector.vue**:
- Replaced text input with `<ImageUploader>` component
- Added `storeId` prop requirement
- Imports `ImageUploader.vue`

**HeroBannerForm.vue**:
- Added `storeId` prop (required)
- Passes `storeId` to `VisualTypeSelector`

**Pages (create.vue & edit.vue)**:
- Pass `storeId` prop to `HeroBannerForm`

### 3. API Client Functions
**File**: `justshop-frontend/app/utils/api/heroBanners.ts`

Added two new functions:
```typescript
// Upload image file
export async function uploadHeroBannerImage(
  storeId: number,
  file: File
): Promise<{ success: boolean; data: { path: string; url: string; full_url: string } }>

// Delete image by path
export async function deleteHeroBannerImage(
  storeId: number,
  path: string
): Promise<void>
```

## User Flow

### Creating New Banner with Image

1. User selects "Image" as visual type
2. Sees upload area with drag & drop zone
3. User either:
   - Drags image file onto upload area
   - Clicks to open file picker
4. Frontend validates file (type, size)
5. Shows upload progress bar
6. Uploads to backend via FormData
7. Backend:
   - Validates file
   - Generates unique filename
   - Stores in `storage/app/public/hero/`
   - Returns file path
8. Frontend shows image preview
9. User completes rest of form and saves
10. Banner is created with `image_path` = `hero/{filename}.jpg`

### Editing Existing Banner with Image

1. User opens edit page
2. If banner has `image_path`, shows preview immediately
3. User can:
   - Keep existing image
   - Delete and upload new one
   - Delete without replacement (for gradient/video)

### Deleting Image

1. User clicks delete button (X) on preview
2. Browser confirms: "Are you sure you want to remove this image?"
3. If confirmed:
   - Frontend calls delete API
   - Backend deletes physical file
   - Frontend clears preview
   - Form field is empty (user can upload new image)

## File Storage Structure

```
storage/
└── app/
    └── public/
        └── hero/
            ├── abc123xyz.jpg
            ├── def456uvw.png
            └── ghi789rst.webp

public/
└── storage/  → symlink to storage/app/public/
```

Access URLs:
- Development: `http://localhost:8000/storage/hero/abc123xyz.jpg`
- Production: `https://yourdomain.com/storage/hero/abc123xyz.jpg`

## Security Features

### Backend
- ✅ File type validation (only images)
- ✅ File size limit (5MB)
- ✅ Path traversal prevention
- ✅ Unique random filenames (prevents overwrites)
- ✅ Scoped to `hero/` directory only

### Frontend
- ✅ Client-side validation before upload
- ✅ Progress indication
- ✅ User confirmation before delete
- ✅ Error handling with user-friendly messages

## Visual Design

The ImageUploader component features:
- Clean, modern design with rounded corners
- Dashed border upload area
- Blue accent color on hover/drag
- Clear upload icon
- Progress bar with smooth animation
- Image preview with overlay delete button
- Red delete button (danger action)
- Responsive layout

## Testing

### Test Upload
1. Go to `/en/merchant/hero-banners/create`
2. Select "Image" visual type
3. Drag an image file or click to upload
4. Verify progress bar shows
5. Verify preview appears
6. Check browser Network tab: POST to `/upload-image` returns path
7. Complete form and save
8. Check database: `image_path` should be `hero/{filename}.ext`

### Test Delete
1. Edit existing banner with image
2. Click X button on preview
3. Confirm deletion
4. Verify preview disappears
5. Check browser Network tab: DELETE to `/delete-image` succeeds
6. Check filesystem: File should be deleted

### Test Validation
1. Try uploading > 5MB file → Should show error
2. Try uploading PDF → Should show "only images allowed"
3. Try uploading valid JPG → Should work

## Files Modified

### Backend (3 files)
1. `app/Http/Controllers/Api/Merchant/AdminFileUploadController.php` (NEW)
2. `routes/api/v1/merchant/admin.php` (UPDATED - added 2 routes)

### Frontend (6 files)
1. `app/components/merchant/hero-banners/ImageUploader.vue` (NEW)
2. `app/components/merchant/hero-banners/VisualTypeSelector.vue` (UPDATED)
3. `app/components/merchant/hero-banners/HeroBannerForm.vue` (UPDATED)
4. `app/pages/merchant/hero-banners/create.vue` (UPDATED)
5. `app/pages/merchant/hero-banners/[id]/edit.vue` (UPDATED)
6. `app/utils/api/heroBanners.ts` (UPDATED - added 2 functions)

## Benefits

### Before (Bad UX)
- User had to type: `hero/banner.jpg`
- No validation
- No preview
- Typos common
- File must already exist in storage

### After (Good UX)
- Drag & drop upload
- Visual feedback
- Instant preview
- Client & server validation
- File is automatically uploaded
- Clean, professional interface

## Status
✅ **COMPLETE** - Full file upload system with drag & drop, validation, progress, preview, and delete functionality
