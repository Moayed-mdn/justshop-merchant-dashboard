# Routing Standardization Investigation

## Current State Analysis

### Pattern Inconsistencies Found

#### 1. Edit Page Location Patterns

**Pattern A: Combined Detail/Edit** (`[id]/page.tsx`)
- Hero Banners: `/merchant/hero-banners/[id]/page.tsx` ✅ EXISTS
  - Combines view + edit functionality
  - Less flexible for future read-only views

**Pattern B: Separated Edit** (`[id]/edit/page.tsx`)
- Products: `/merchant/products/[productId]/edit/page.tsx` ✅ EXISTS
- CMS Pages: `/merchant/cms/pages/[id]/edit/page.tsx` ✅ EXISTS
- Allows future `[id]/page.tsx` for read-only detail views
- Better separation of concerns

**Recommendation**: Adopt Pattern B (`[id]/edit/page.tsx`) as standard

---

### 2. Missing Merchant Edit Pages

#### Categories
- ❌ List: `/merchant/categories/page.tsx` EXISTS
- ❌ Create: `/merchant/categories/new/page.tsx` EXISTS
- ❌ **Edit: `/merchant/categories/[id]/edit/page.tsx` MISSING**

#### Brands
- ✅ List: `/merchant/brands/page.tsx` EXISTS
- ✅ Create: `/merchant/brands/new/page.tsx` EXISTS
- ❌ **Edit: `/merchant/brands/[id]/edit/page.tsx` MISSING**

#### Tags
- ✅ List: `/merchant/tags/page.tsx` EXISTS
- ✅ Create: `/merchant/tags/new/page.tsx` EXISTS
- ❌ **Edit: `/merchant/tags/[id]/edit/page.tsx` MISSING**

#### Orders
- ✅ List: `/merchant/orders/page.tsx` EXISTS
- ❌ **Detail: `/merchant/orders/[id]/page.tsx` MISSING**

#### Customers
- ✅ List: `/merchant/customers/page.tsx` EXISTS
- ❌ **Detail: `/merchant/customers/[id]/page.tsx` MISSING**

---

### 3. Legacy Route Status

#### Legacy Routes That STILL RENDER Content (Need Redirect)

**Categories:**
- ✅ File exists: `stores/[storeId]/categories/[categoryId]/edit/page.tsx`
- ❌ **Still renders EditCategoryContent** (should use LegacyRouteRedirector)

**Brands:**
- ✅ File exists: `stores/[storeId]/brands/[brandId]/edit/page.tsx`
- ❌ **Still renders EditBrandContent** (should use LegacyRouteRedirector)

**Tags:**
- ✅ File exists: `stores/[storeId]/tags/[tagId]/edit/page.tsx`
- ❌ **Still renders EditTagContent** (should use LegacyRouteRedirector)

#### Legacy Routes That DON'T EXIST (Need Creation)

**Products:**
- ❌ `/stores/[storeId]/products/[productId]/page.tsx` - MISSING (detail view)
- ❌ `/stores/[storeId]/products/[productId]/edit/page.tsx` - MISSING

**Orders:**
- ✅ `/stores/[storeId]/orders/[orderId]/page.tsx` - EXISTS (detail view)
- ❌ `/stores/[storeId]/orders/[orderId]/edit/page.tsx` - MISSING (if editable)

**Users/Customers:**
- ✅ `/stores/[storeId]/users/[userId]/page.tsx` - EXISTS (detail view)
- ❌ `/stores/[storeId]/users/[userId]/edit/page.tsx` - MISSING (if editable)

---

### 4. Route Configuration Gaps

#### Current ROUTES.merchant (Missing Edit Routes)

```typescript
merchant: {
  categories: {
    list: () => '/merchant/categories',
    new:  () => '/merchant/categories/new',
    // ❌ MISSING: edit: (id) => `/merchant/categories/${id}/edit`
  },
  brands: () => '/merchant/brands', // ❌ Not even nested object
  tags:   () => '/merchant/tags',   // ❌ Not even nested object
  orders: () => '/merchant/orders', // ❌ Missing detail route
  customers: () => '/merchant/customers', // ❌ Missing detail route
}
```

#### Should Be:

```typescript
merchant: {
  categories: {
    list: () => '/merchant/categories',
    new:  () => '/merchant/categories/new',
    edit: (categoryId: string) => `/merchant/categories/${categoryId}/edit`,
  },
  brands: {
    list: () => '/merchant/brands',
    new:  () => '/merchant/brands/new',
    edit: (brandId: string) => `/merchant/brands/${brandId}/edit`,
  },
  tags: {
    list: () => '/merchant/tags',
    new:  () => '/merchant/tags/new',
    edit: (tagId: string) => `/merchant/tags/${tagId}/edit`,
  },
  orders: {
    list: () => '/merchant/orders',
    detail: (orderId: string) => `/merchant/orders/${orderId}`,
  },
  customers: {
    list: () => '/merchant/customers',
    detail: (customerId: string) => `/merchant/customers/${customerId}`,
  },
}
```

---

## Implementation Plan

### Phase 1: Standardize Hero Banners

**Action**: Move hero banner edit from `[id]/page.tsx` to `[id]/edit/page.tsx`

**Changes:**
1. Create: `/merchant/hero-banners/[id]/edit/page.tsx`
2. Delete: `/merchant/hero-banners/[id]/page.tsx` (or repurpose for read-only view)
3. Update `ROUTES.merchant.heroBanners.edit` to use `/edit` suffix

---

### Phase 2: Create Missing Merchant Edit Pages

#### 2.1 Categories Edit Page

**File**: `src/app/[locale]/(merchant)/merchant/categories/[id]/edit/page.tsx`

**Template** (follow products pattern):
```typescript
'use client';

import { useParams } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import EditCategoryContent from '@/features/dashboard/categories/EditCategoryContent';
import { EditCategorySkeleton } from '@/features/dashboard/categories/EditCategorySkeleton';
// Add useCategory hook or query

export default function MerchantCategoryEditPage() {
  const params = useParams<{ id: string }>();
  const categoryId = params.id;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const storeId = activeStore ? String(activeStore.id) : '';

  // Query category data
  // const { data: category, isLoading, error } = useCategory(storeId, categoryId);

  if (!activeStore) {
    return <WorkspaceEmptyState title="No active store" />;
  }

  // Handle loading, error, and render EditCategoryContent
}
```

#### 2.2 Brands Edit Page

**File**: `src/app/[locale]/(merchant)/merchant/brands/[id]/edit/page.tsx`

Same pattern as categories, using `EditBrandContent`.

#### 2.3 Tags Edit Page

**File**: `src/app/[locale]/(merchant)/merchant/tags/[id]/edit/page.tsx`

Same pattern as categories, using `EditTagContent`.

#### 2.4 Orders Detail Page

**File**: `src/app/[locale]/(merchant)/merchant/orders/[id]/page.tsx`

Read-only detail view (orders typically aren't "edited" but updated via status changes).

#### 2.5 Customers Detail Page

**File**: `src/app/[locale]/(merchant)/merchant/customers/[id]/page.tsx`

Detail view for customer information.

---

### Phase 3: Update Route Configuration

**File**: `src/config/routes.ts`

**Changes Needed:**

```typescript
merchant: {
  categories: {
    list: () => '/merchant/categories' as const,
    new:  () => '/merchant/categories/new' as const,
    edit: (categoryId: string) => `/merchant/categories/${categoryId}/edit` as const,
  },
  brands: {
    list: () => '/merchant/brands' as const,
    new:  () => '/merchant/brands/new' as const,
    edit: (brandId: string) => `/merchant/brands/${brandId}/edit` as const,
  },
  tags: {
    list: () => '/merchant/tags' as const,
    new:  () => '/merchant/tags/new' as const,
    edit: (tagId: string) => `/merchant/tags/${tagId}/edit` as const,
  },
  orders: {
    list: () => '/merchant/orders' as const,
    detail: (orderId: string) => `/merchant/orders/${orderId}` as const,
  },
  customers: {
    list: () => '/merchant/customers' as const,
    detail: (customerId: string) => `/merchant/customers/${customerId}` as const,
  },
  heroBanners: {
    list: () => '/merchant/hero-banners' as const,
    new:  () => '/merchant/hero-banners/new' as const,
    edit: (bannerId: string) => `/merchant/hero-banners/${bannerId}/edit` as const, // Changed
  },
}
```

---

### Phase 4: Fix Legacy Route Redirectors

#### 4.1 Convert Rendering Pages to Redirectors

**Categories:**
```typescript
// src/app/[locale]/(dashboard)/stores/[storeId]/categories/[categoryId]/edit/page.tsx
'use client';

import { use } from 'react';
import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

export default function LegacyCategoryEditPage({
  params,
}: {
  params: Promise<{ storeId: string; categoryId: string }>;
}) {
  const { storeId, categoryId } = use(params);
  
  return (
    <LegacyRouteRedirector
      storeId={storeId}
      targetPath={ROUTES.merchant.categories.edit(categoryId)}
      originalRoute={`/stores/${storeId}/categories/${categoryId}/edit`}
    />
  );
}
```

**Brands:**
Same pattern, targeting `ROUTES.merchant.brands.edit(brandId)`

**Tags:**
Same pattern, targeting `ROUTES.merchant.tags.edit(tagId)`

#### 4.2 Create Missing Legacy Redirectors

**Products Edit:**
```typescript
// src/app/[locale]/(dashboard)/stores/[storeId]/products/[productId]/edit/page.tsx
'use client';

import { use } from 'react';
import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

export default function LegacyProductEditPage({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>;
}) {
  const { storeId, productId } = use(params);
  
  return (
    <LegacyRouteRedirector
      storeId={storeId}
      targetPath={ROUTES.merchant.products.edit?.(productId) ?? `/merchant/products/${productId}/edit`}
      originalRoute={`/stores/${storeId}/products/${productId}/edit`}
    />
  );
}
```

**Orders Detail:** (if needed)
**Users Detail:** (if needed)

---

### Phase 5: Update Documentation

**File**: `docs/frontend/legacy-route-compatibility.md`

**Update to include edit/detail routes:**

```markdown
## Supported Legacy Routes

### List Pages
- `/stores/{id}/dashboard` → `/merchant/dashboard`
- `/stores/{id}/products` → `/merchant/products`
- `/stores/{id}/orders` → `/merchant/orders`
- `/stores/{id}/categories` → `/merchant/categories`
- `/stores/{id}/brands` → `/merchant/brands`
- `/stores/{id}/tags` → `/merchant/tags`
- `/stores/{id}/users` → `/merchant/customers`

### Detail & Edit Pages
- `/stores/{id}/products/{productId}` → `/merchant/products/{productId}` (detail)
- `/stores/{id}/products/{productId}/edit` → `/merchant/products/{productId}/edit`
- `/stores/{id}/categories/{categoryId}/edit` → `/merchant/categories/{categoryId}/edit`
- `/stores/{id}/brands/{brandId}/edit` → `/merchant/brands/{brandId}/edit`
- `/stores/{id}/tags/{tagId}/edit` → `/merchant/tags/{tagId}/edit`
- `/stores/{id}/orders/{orderId}` → `/merchant/orders/{orderId}` (detail)
- `/stores/{id}/users/{userId}` → `/merchant/customers/{userId}` (detail)
```

---

### Phase 6: Create Convention Documentation

**New File**: `docs/frontend/routing-conventions.md`

```markdown
# Frontend Routing Conventions

## Route Structure

All merchant routes follow this pattern:

```
/merchant/{entity}           - List view
/merchant/{entity}/new       - Create form
/merchant/{entity}/{id}      - Detail view (read-only)
/merchant/{entity}/{id}/edit - Edit form
```

## Examples

**Products:**
- List: `/merchant/products`
- Create: `/merchant/products/new`
- Detail: `/merchant/products/123` (future)
- Edit: `/merchant/products/123/edit`

**Categories:**
- List: `/merchant/categories`
- Create: `/merchant/categories/new`
- Edit: `/merchant/categories/456/edit`

**Orders:** (read-only)
- List: `/merchant/orders`
- Detail: `/merchant/orders/789`

## File Structure

```
app/[locale]/(merchant)/merchant/
├── {entity}/
│   ├── page.tsx              # List view
│   ├── new/
│   │   └── page.tsx          # Create form
│   └── [id]/
│       ├── page.tsx          # Detail view (optional)
│       └── edit/
│           └── page.tsx      # Edit form
```

## Page Implementation Pattern

All merchant pages should:
1. Be `'use client'` components
2. Use `useParams()` to get route parameters
3. Use `useBootstrapStore()` to get activeStore
4. Show `WorkspaceEmptyState` when no activeStore
5. Handle loading and error states
6. Render the appropriate form/content component

## Legacy Compatibility

Legacy store-scoped routes (`/stores/{storeId}/*`) redirect to merchant routes using `LegacyRouteRedirector`.
```

---

## Verification Checklist

### After Implementation:

- [ ] All merchant entities have edit pages following `[id]/edit/page.tsx` pattern
- [ ] Hero banners moved to `/edit` pattern
- [ ] ROUTES config includes all entity edit routes
- [ ] All legacy edit pages use LegacyRouteRedirector
- [ ] Test: `/stores/1/brands/2/edit` → 302 → `/merchant/brands/2/edit`
- [ ] Test: `/stores/1/categories/3/edit` → 302 → `/merchant/categories/3/edit`
- [ ] Test: `/stores/1/tags/4/edit` → 302 → `/merchant/tags/4/edit`
- [ ] Test: `/stores/1/products/5/edit` → 302 → `/merchant/products/5/edit`
- [ ] Test: `/merchant/brands/2/edit` → 200 OK
- [ ] Test: `/merchant/categories/3/edit` → 200 OK
- [ ] Test: `/merchant/tags/4/edit` → 200 OK
- [ ] Test: `/merchant/products/5/edit` → 200 OK
- [ ] No entity returns 404 for either legacy or merchant edit path
- [ ] Documentation updated

---

## Summary

### Current Issues:
1. ❌ Inconsistent edit page location (`[id]` vs `[id]/edit`)
2. ❌ Missing merchant edit pages for categories, brands, tags
3. ❌ Missing detail pages for orders, customers
4. ❌ Legacy routes still rendering content instead of redirecting
5. ❌ Incomplete ROUTES configuration
6. ❌ Documentation doesn't cover edit/detail routes

### Solution:
1. ✅ Standardize on `[id]/edit/page.tsx` pattern
2. ✅ Create all missing merchant pages
3. ✅ Update ROUTES config comprehensively
4. ✅ Convert legacy pages to use LegacyRouteRedirector
5. ✅ Create missing legacy redirect pages
6. ✅ Update and expand documentation

### Impact:
- **Consistency**: All entities follow same routing pattern
- **Maintainability**: Clear conventions for new features
- **Compatibility**: Legacy URLs still work via redirects
- **Future-proof**: Room for detail views separate from edit
- **Developer experience**: Predictable structure

### Estimated Effort:
- Phase 1 (Hero banners): 1-2 hours
- Phase 2 (Create pages): 4-6 hours
- Phase 3 (Route config): 1 hour
- Phase 4 (Legacy redirects): 2-3 hours
- Phase 5-6 (Documentation): 1-2 hours
- **Total: 9-14 hours** (1-2 days)

---

**Status**: Analysis Complete - Ready for Implementation
**Priority**: High - Affects core navigation and UX consistency
**Breaking Changes**: None (maintains backward compatibility via redirects)
