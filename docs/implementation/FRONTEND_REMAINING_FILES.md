# Hero Banner Frontend - Remaining Files

## ✅ Created So Far

1. ✅ `types/heroBanner.ts` - TypeScript type definitions
2. ✅ `app/utils/api/heroBanners.ts` - API client functions

## ⏳ Remaining Files to Create

### 3. Composable (Data Fetching Layer)
**File**: `app/composables/useHeroBanners.ts` (~150 lines)

This composable will:
- Fetch hero banners list with filters
- Fetch single hero banner
- Create/update/delete/restore operations
- Handle loading states and errors
- Provide reactive data

### 4. Components (5 files, ~1000 lines total)

#### 4.1 List Component
**File**: `app/components/merchant/hero-banners/HeroBannersList.vue` (~300 lines)
- Display banners in a table
- Show visual type badges
- Edit/Delete/Restore action buttons
- Empty state when no banners

#### 4.2 Filters Component
**File**: `app/components/merchant/hero-banners/HeroBannerFilters.vue` (~100 lines)
- Status dropdown (all/active/inactive/trashed)
- Search input
- Clear filters button

#### 4.3 Visual Type Selector
**File**: `app/components/merchant/hero-banners/VisualTypeSelector.vue` (~150 lines)
- Radio buttons or tabs for image/gradient/video
- Conditional fields based on selection:
  - Image: show image path input
  - Gradient: show color pickers for gradient_from and gradient_to
  - Video: show video URL input

#### 4.4 Translation Tabs
**File**: `app/components/merchant/hero-banners/TranslationTabs.vue` (~200 lines)
- Tabs for EN and AR
- Title, subtitle, CTA text inputs per language
- Validation indicators

#### 4.5 Form Component
**File**: `app/components/merchant/hero-banners/HeroBannerForm.vue` (~400 lines)
- All form fields
- Uses VisualTypeSelector and TranslationTabs
- Form validation
- Submit/cancel buttons
- Loading states
- Error handling

### 5. Pages (3 files, ~250 lines total)

#### 5.1 List Page
**File**: `app/pages/merchant/hero-banners/index.vue` (~80 lines)
- Page title and "Create" button
- Uses HeroBannerFilters
- Uses HeroBannersList
- Uses useHeroBanners composable

#### 5.2 Create Page
**File**: `app/pages/merchant/hero-banners/create.vue` (~80 lines)
- Page title and back button
- Uses HeroBannerForm
- Handles create submission
- Redirects on success

#### 5.3 Edit Page
**File**: `app/pages/merchant/hero-banners/[id]/edit.vue` (~90 lines)
- Fetches existing banner data
- Page title and back button
- Uses HeroBannerForm with pre-filled data
- Handles update submission
- Shows metadata (created, updated dates)

## File Structure Summary

```
justshop-frontend/
├── types/
│   └── heroBanner.ts                                  ✅ CREATED
├── app/
│   ├── utils/api/
│   │   └── heroBanners.ts                            ✅ CREATED
│   ├── composables/
│   │   └── useHeroBanners.ts                         ⏳ TODO
│   ├── components/merchant/hero-banners/
│   │   ├── HeroBannersList.vue                       ⏳ TODO
│   │   ├── HeroBannerFilters.vue                     ⏳ TODO
│   │   ├── VisualTypeSelector.vue                    ⏳ TODO
│   │   ├── TranslationTabs.vue                       ⏳ TODO
│   │   └── HeroBannerForm.vue                        ⏳ TODO
│   └── pages/merchant/hero-banners/
│       ├── index.vue                                  ⏳ TODO
│       ├── create.vue                                 ⏳ TODO
│       └── [id]/
│           └── edit.vue                               ⏳ TODO
```

## Implementation Priority

### Option 1: Create All Files Now
I can create all remaining 9 files in one go. This will be comprehensive but will use significant context.

### Option 2: Create Core Files First (Recommended)
**Phase 1** (Most Critical):
1. `useHeroBanners.ts` composable
2. `HeroBannerForm.vue` component
3. `index.vue` page (list)
4. `create.vue` page

**Phase 2** (Supporting):
5. `HeroBannersList.vue` component
6. `HeroBannerFilters.vue` component
7. `[id]/edit.vue` page

**Phase 3** (Enhancements):
8. `VisualTypeSelector.vue` component
9. `TranslationTabs.vue` component

### Option 3: Create Minimal Working Version
Create simplified versions of:
1. Composable (basic CRUD)
2. One form component (all-in-one)
3. Three pages (minimal styling)

Then enhance later.

## What Do You Want?

Please choose:
- **A**: Create all 9 files now (complete implementation)
- **B**: Create Phase 1 first (core functionality, 4 files)
- **C**: Create minimal working version (3 files)
- **D**: I'll guide you file-by-file (you tell me which to create next)

**My Recommendation**: **Option B** - Create Phase 1 first, test it, then add Phase 2.

This way you can:
1. Test the basic CRUD immediately
2. Ensure the API integration works
3. Add polish and enhancements after

---

**Current Status**:
- ✅ Backend: 100% Complete & Tested
- ✅ Frontend Types & API: Created (2/11 files)
- ⏳ Frontend Components & Pages: Pending (9/11 files)

Let me know your choice and I'll proceed!
