# Gaps & Known Issues

## 1. Missing Features
- **Checkout & Payments**: The backend stubs exist, but the frontend checkout journey and payment provider integration (e.g., Stripe) are not yet implemented.
- **Product Search**: Public storefront search is planned but not currently present in the codebase.
- **Advanced Inventory**: Tracking inventory across multiple warehouses/locations is not yet supported.

## 2. Incomplete Implementations
- **Variant Media**: The product model supports `media` per variant, but the current UI does not allow merchants to assign specific images to specific variants (e.g., assigning a "Red" image to the Red variant).
- **Bulk Operations**: Bulk editing of product prices, stock, or status is not yet implemented.
- **CMS Interactive Blocks**: The section builder supports static blocks but lacks interactive elements like contact forms or dynamic product carousels.

## 3. Route Conflicts & Migration Issues
- **Workspace Route 404s**: Canonical workspace routes (`/merchant/products/new`, `/merchant/categories/new`) are returning 404 errors in the Playwright environment, despite files existing on disk. This suggests a routing or middleware conflict.
- **Legacy Cleanup**: Some legacy `/stores/[storeId]` components are still active and should be fully removed once the workspace-centric migration is validated in production.
- **URL Divergence**: Some deep links in email templates may still point to legacy routes that require double-redirection.

## 4. Known Bugs
- **Creation Flow Blockers**: 
  - Product creation wizard is inaccessible via direct URL (404).
  - Category creation is inaccessible via direct URL (404).
  - Additional store creation fails because the "Create store" link is missing or times out on the stores list page.
- **Password Recovery Tests**: The "Forgot Password" and "Reset Password" flows are missing Playwright E2E coverage, making them high-risk for regression.

## 5. Technical Debt
- **Media Library**: Assets are currently managed per-product; a global "Media Library" for re-using images across different products and CMS pages is needed.
- **CSS Logical Properties**: While RTL is supported, some older components may still use physical properties (e.g., `padding-left`) instead of logical properties (e.g., `padding-inline-start`).
- **Session Stubbing**: The `getSessions()` API in `src/lib/api/auth.ts` is currently stubbed and needs a real implementation.

## 6. Recommended Priorities
1. **Critical Path Testing**: Implement E2E tests for the password recovery flow.
2. **Storefront Baseline**: Complete the basic product catalog and "Add to Cart" functionality on the public storefront.
3. **Workspace Finalization**: Remove remaining legacy route adapters and unify the navigation logic.
4. **Variant UX**: Enhance the product editor to support per-variant image assignment.
