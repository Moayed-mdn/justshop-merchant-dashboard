# Catalog Review

## Goal

Verify that a merchant can comprehensively manage their product catalog including creating products with variants, organizing categories hierarchically, managing inventory levels, and handling product visibility. This mission validates the complete product lifecycle from creation through inventory management to publication.

## Entry Point

Merchant dashboard: `/en/merchant/dashboard` (authenticated as merchant with catalog management permissions)

## Preconditions

- Merchant account exists with active store
- User is logged in with product.create, product.edit, category.create permissions
- At least one brand exists in the system
- Mock backend is ready to accept product data

## Steps

1. Navigate to Categories section from sidebar
2. Observe existing category list
3. Click "Create Category" button
4. Fill category form:
   - English name: "Summer Apparel"
   - English slug: "summer-apparel"
   - Arabic name: "ملابس صيفية"
   - Arabic slug: "summer-apparel-ar"
   - Global slug: "summer-apparel"
   - Status: Active
5. Submit category creation
6. Verify category appears in list
7. Create second category as child:
   - Name: "T-Shirts"
   - Parent: "Summer Apparel"
8. Verify hierarchical structure in category list
9. Navigate to Products section
10. Click "Create Product" or "New Product" button
11. Observe product creation wizard or form
12. Fill Step 1 - Content (English tab):
    - Product name: "Classic Cotton T-Shirt"
    - Slug: "classic-cotton-tshirt"
    - Description: Rich text with bullet points
    - Short description: Summary text
13. Switch to Arabic tab and fill translations:
    - Product name: "قميص قطني كلاسيكي"
    - Slug: "classic-cotton-tshirt-ar"
    - Description and short description in Arabic
14. Click Next to proceed to Step 2 - Structure
15. Select product type: "Variable" (has variants)
16. Add variant attributes:
    - Size: S, M, L, XL
    - Color: White, Black, Navy
17. Click Next to Step 3 - Pricing & Inventory
18. Set base price: $29.99
19. Configure variant-specific pricing and inventory:
    - White/S: Stock 50, Price $29.99
    - White/M: Stock 75, Price $29.99
    - Black/L: Stock 30, Price $34.99
20. Set SKU prefix: "CCT"
21. Click Next to Step 4 - Media
22. Upload or select product images (if available)
23. Set primary image
24. Add gallery images
25. Click Next to Step 5 - Organization
26. Select category: "T-Shirts"
27. Select brand from dropdown
28. Add tags: "cotton", "casual", "summer"
29. Click Next to Step 6 - SEO & Visibility
30. Set meta title and description
31. Set product status: "Published"
32. Set visibility: "Visible in catalog and search"
33. Click Next to Step 7 - Review
34. Review all entered information
35. Submit product creation
36. Observe success message
37. Verify redirect to product edit page or product list
38. Navigate back to Products list
39. Verify newly created product appears in list with correct thumbnail
40. Click product to edit
41. Navigate to Inventory tab
42. Modify stock for one variant (e.g., White/M: 75 → 60)
43. Save inventory changes
44. Verify success message
45. Navigate to product list
46. Apply filter by category: "T-Shirts"
47. Verify filtered results show only T-Shirts
48. Apply filter by status: "Published"
49. Clear filters
50. Search for product by name: "Classic Cotton"
51. Verify search results display correct product
52. Select product and change status to "Draft"
53. Verify product no longer shows as published
54. Navigate to Categories
55. Edit "Summer Apparel" category
56. Change status to "Inactive"
57. Save category changes
58. Verify products in that category reflect status change (if applicable)

## Expected Behavior

- Category creation supports multilingual input with separate slug fields
- Hierarchical categories display parent-child relationships visually
- Product creation wizard guides through logical steps
- Tab switching between languages preserves entered data
- Variant configuration generates all combinations automatically
- Inventory can be set globally or per-variant
- SKU generation follows configured pattern with auto-increment
- Image upload supports multiple files with drag-and-drop
- Primary image selection is clearly indicated
- Category and brand selection uses searchable dropdowns
- Tags support auto-complete from existing tags
- SEO fields include character count helpers
- Review step displays all configured data before submission
- Product list shows thumbnails, name, price, stock, status
- Filtering and search update results instantly
- Bulk actions allow status changes for multiple products
- Stock levels update in real-time
- Low stock warnings appear for products below threshold
- Product status changes reflect immediately in storefront
- Category status affects all child products and subcategories
- No data loss occurs when navigating between wizard steps
- Form validation prevents submission of incomplete data
- Rich text editor supports formatting and media embedding

## Defect Reporting Instructions

When a defect is found:
- Capture screenshot of the catalog section and affected product/category
- Capture browser console errors
- Capture network failures (especially during multi-step creation)
- Record exact reproduction steps from entry point
- Identify affected entity (product, variant, category)
- Note whether defect causes data loss or data corruption
- Check if multilingual data is correctly saved for all languages
- Verify if variant combinations generate correctly
- Verify if inventory updates reflect across all references
- Propose root cause when possible (e.g., "Wizard loses data when navigating backwards", "Variant price overrides do not persist", "Category hierarchy does not save parent relationship", "Image upload fails without user feedback")

## Completion Criteria

The mission is considered successful when:
- All steps complete successfully
- Expected behavior is observed at each step
- No blocking defects prevent catalog management
- Products can be created with full multilingual support
- Variants generate correctly with independent inventory
- Categories support hierarchical organization
- Inventory updates persist and reflect in real-time
- Search and filtering return accurate results
- Product status changes affect storefront visibility
- No data loss or corruption occurs during multi-step workflows
- All product data displays correctly in list and detail views
