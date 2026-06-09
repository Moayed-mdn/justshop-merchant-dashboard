# OpenCoder Testing Guide - Improved Approach

## Overview

Test the routing standardization by **creating resources first, then editing them**. This eliminates ID confusion and tests the full workflow.

---

## Prerequisites

1. ✅ Dev server running: `npm run dev` (Port 4000)
2. ✅ Backend running: `php artisan serve` (Port 8000)
3. ✅ Playwright MCP configured in OpenCoder
4. ✅ Valid merchant credentials

---

## 🚀 Testing Command for OpenCoder

**Copy this exact message** (replace with your credentials):

```
Please test the routing standardization by creating and editing resources:

STEP 1: LOGIN
- Navigate to http://localhost:3001/en/login
- Email: [YOUR_EMAIL_HERE]
- Password: [YOUR_PASSWORD_HERE]
- Wait for redirect to merchant dashboard

STEP 2: CREATE AND TEST CATEGORIES
1. Click "Categories" in the sidebar
2. Click "New Category" button
3. Fill in the form:
   - Name (EN): "Test Category"
   - Slug: "test-category"
4. Click "Create category" button
5. Note the ID from the response or URL after creation
6. Navigate to /en/merchant/categories/{newId}/edit
7. Verify the edit form loads with the category data
8. Take a screenshot

STEP 3: CREATE AND TEST BRANDS
1. Click "Brands" in the sidebar
2. Click "New Brand" button
3. Fill in the form:
   - Name: "Test Brand"
   - Slug: "test-brand"
4. Click "Create brand" button
5. Note the ID from the response
6. Navigate to /en/merchant/brands/{newId}/edit
7. Verify the edit form loads
8. Take a screenshot

STEP 4: CREATE AND TEST TAGS
1. Click "Tags" in the sidebar
2. Click "New Tag" button
3. Fill in the form:
   - Name (EN): "Test Tag"
   - Slug: "test-tag"
   - Type: "general"
4. Click "Create tag" button
5. Note the ID from the response
6. Navigate to /en/merchant/tags/{newId}/edit
7. Verify the edit form loads
8. Take a screenshot

STEP 5: CREATE AND TEST HERO BANNERS
1. Click "Hero Banners" in the sidebar
2. Click "New Banner" button
3. Fill in required fields
4. Save the banner
5. Note the ID from the response
6. Navigate to /en/merchant/hero-banners/{newId}/edit
7. Verify the edit form loads
8. Take a screenshot

STEP 6: TEST LEGACY REDIRECTS
Using the category ID from Step 2:
1. Get the current store ID from the URL or store switcher
2. Navigate to: /en/stores/{storeId}/categories/{categoryId}/edit
3. Verify it redirects to: /en/merchant/categories/{categoryId}/edit
4. Verify the edit form loads after redirect
5. Report the redirect behavior

STEP 7: REPORT RESULTS
Create a table with columns:
- Resource Type
- New Record ID
- Edit URL Tested
- Status (✅/❌)
- Screenshot Path
- Console Errors (if any)
```

**Replace `[YOUR_EMAIL_HERE]` and `[YOUR_PASSWORD_HERE]` with your actual credentials.**

---

## Why This Approach is Better

### ❌ Old Approach (Hardcoded IDs)
```
Test: /en/merchant/categories/1/edit
Problem: ID 1 might not exist in this store
Result: 404 errors, confusion about whether routing works
```

### ✅ New Approach (Create First)
```
1. Create category → API returns { id: 47, name: "Test Category", ... }
2. Test: /en/merchant/categories/47/edit
3. Result: Guaranteed to work if routing is correct
```

### Benefits:
- ✅ **No ID guessing** - Use actual created IDs
- ✅ **Works with any store** - No database dependency
- ✅ **Tests full workflow** - Create → Edit flow
- ✅ **Eliminates confusion** - 404 means routing bug, not missing data
- ✅ **Realistic scenario** - Mimics real user behavior

---

## API Endpoints Reference

### Create Resources

**Categories:**
```bash
POST /api/v1/merchant/stores/{storeId}/categories
Body: {
  "translations": {
    "en": { "name": "Test Category" }
  },
  "slug": "test-category",
  "is_active": true
}
Response: { "data": { "id": 47, "slug": "test-category", ... } }
```

**Brands:**
```bash
POST /api/v1/merchant/stores/{storeId}/brands
Body: {
  "name": "Test Brand",
  "slug": "test-brand",
  "is_active": true
}
Response: { "data": { "id": 12, "slug": "test-brand", ... } }
```

**Tags:**
```bash
POST /api/v1/merchant/stores/{storeId}/tags
Body: {
  "translations": {
    "en": { "name": "Test Tag" }
  },
  "slug": "test-tag",
  "type": "general",
  "is_active": true
}
Response: { "data": { "id": 8, "slug": "test-tag", ... } }
```

**Hero Banners:**
```bash
POST /api/v1/merchant/stores/{storeId}/hero-banners
Body: {
  "translations": {
    "en": {
      "title": "Test Banner",
      "subtitle": "Test Subtitle",
      "cta_text": "Click Here",
      "cta_link": "/test"
    }
  },
  "visual_type": "image",
  "desktop_media": "https://example.com/image.jpg",
  "position": 1,
  "is_active": true
}
Response: { "data": { "id": 5, "position": 1, ... } }
```

---

## Expected Test Flow

### 1. Create Category (via UI)
```
User action: Click "New Category" → Fill form → Save
Backend: POST /api/v1/merchant/stores/2/categories
Response: { "data": { "id": 47, "slug": "test-category", ... } }
Frontend: Redirect to /en/merchant/categories (list page)
```

### 2. Navigate to Edit Page
```
Action: Navigate to /en/merchant/categories/47/edit
Expected: Edit form loads with category data
Page should show:
- Name field with "Test Category"
- Slug field with "test-category"
- Active toggle checked
- Save button present
```

### 3. Test Legacy Redirect
```
Action: Navigate to /en/stores/2/categories/47/edit
Expected:
1. "Switching Workspace Context" message appears
2. Store context switches to Store ID 2
3. Redirects to /en/merchant/categories/47/edit
4. Edit form loads with category data
```

---

## Sample OpenCoder Report

**Expected output from OpenCoder:**

```
✅ Test Results:

LOGIN:
✅ Logged in successfully as merchant@example.com
✅ Active store: Store 2 (ID: 2)

CATEGORIES:
✅ Created category: "Test Category" (ID: 47)
✅ Edit page loaded: /en/merchant/categories/47/edit
✅ Form shows correct data
✅ No console errors
📸 Screenshot: category-edit-47.png

BRANDS:
✅ Created brand: "Test Brand" (ID: 12)
✅ Edit page loaded: /en/merchant/brands/12/edit
✅ Form shows correct data
✅ No console errors
📸 Screenshot: brand-edit-12.png

TAGS:
✅ Created tag: "Test Tag" (ID: 8)
✅ Edit page loaded: /en/merchant/tags/8/edit
✅ Form shows correct data
✅ No console errors
📸 Screenshot: tag-edit-8.png

HERO BANNERS:
✅ Created banner: "Test Banner" (ID: 5)
✅ Edit page loaded: /en/merchant/hero-banners/5/edit
✅ Form shows correct data
✅ No console errors
📸 Screenshot: hero-banner-edit-5.png

LEGACY REDIRECTS:
✅ /en/stores/2/categories/47/edit → redirected to /en/merchant/categories/47/edit
✅ Edit form loaded after redirect
✅ Store context preserved
✅ No errors

SUMMARY TABLE:
| Resource      | New ID | Edit URL                              | Status | Errors |
|---------------|--------|---------------------------------------|--------|--------|
| Category      | 47     | /merchant/categories/47/edit          | ✅     | None   |
| Brand         | 12     | /merchant/brands/12/edit              | ✅     | None   |
| Tag           | 8      | /merchant/tags/8/edit                 | ✅     | None   |
| Hero Banner   | 5      | /merchant/hero-banners/5/edit         | ✅     | None   |
| Legacy (cat)  | 47     | /stores/2/categories/47/edit → /merchant/categories/47/edit | ✅ | None |

All tests passed! ✅
```

---

## Troubleshooting

### Issue: "Create button not found"
**Solution:** Check the navigation sidebar, button might be labeled differently

### Issue: "Form validation errors"
**Solution:** Make sure all required fields are filled:
- Categories: name (EN), slug
- Brands: name, slug
- Tags: name (EN), slug, type
- Hero Banners: title (EN), subtitle (EN), visual_type, media URL

### Issue: "Can't extract ID from response"
**Solution:** Check the URL after save - ID should be in the redirect URL or ask OpenCoder to:
```
After creating the category, examine the network tab response and extract the "id" field from the JSON response.
```

---

## Alternative: API-First Approach

If the UI creates have issues, you can ask OpenCoder to use the API directly:

```
Please test using the API:

1. Login to get auth token
2. Create category via POST /api/v1/merchant/stores/2/categories
3. Extract ID from response
4. Navigate to /en/merchant/categories/{id}/edit in the browser
5. Verify page loads
```

---

## Benefits Summary

| Aspect | Old Approach (ID=1) | New Approach (Create First) |
|--------|---------------------|------------------------------|
| ID existence | ❌ Might not exist | ✅ Guaranteed to exist |
| Store dependency | ❌ Depends on seed data | ✅ Works with any store |
| Error clarity | ❌ 404 could be route or data | ✅ 404 = routing bug |
| Real-world test | ⚠️ Partial | ✅ Full workflow |
| Multi-store safe | ❌ No | ✅ Yes |

---

## Ready to Test!

Copy the testing command from the **"🚀 Testing Command for OpenCoder"** section, replace your credentials, and paste it into OpenCoder with Playwright MCP!

**This approach will give you accurate, reliable test results.** 🎭✨

