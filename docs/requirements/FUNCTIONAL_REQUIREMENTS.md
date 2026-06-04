# Functional Requirements

---

## Verification Notes (Last Updated: 2025)

### Key Findings from Codebase Verification:
1. **Product Editor Tabs**: The product editor only has 3 tabs (Content, Structure, Media). There is NO SEO tab.
2. **Brand Localization**: Brands do NOT support localized names/slugs. They have single `name` and `slug` fields only.
3. **Customers Route**: The `/merchant/customers` route actually renders store members/users (same as `/stores/{storeId}/users`), not customer accounts.
4. **Route Migration Status**: Creation routes (new product, new category, new store) only exist in legacy `/stores/{storeId}/` format; canonical `/merchant/` creation routes are missing.
5. **Sidebar Navigation**: Sidebar currently uses legacy `/stores/{storeId}/` routes, not canonical `/merchant/` routes.

---

## 1. System Overview
LaraTenant Commerce is a multi-tenant ecommerce platform that allows merchants to manage multiple stores, products, and orders through a unified dashboard. It supports internationalization (English and Arabic) and uses a headless architecture with a Next.js frontend and Laravel backend.

## 2. User Roles & Personas
- **REQ-ROLES-1: Super Admin**
  - Description: Global administrator with full access to the entire platform.
  - Acceptance Criteria:
    - Can access any store dashboard.
    - Can manage platform-level settings.
  - Current Status: Implemented
- **REQ-ROLES-2: Store Admin**
  - Description: Merchant user with full control over their specific store(s).
  - Acceptance Criteria:
    - Can manage products, orders, categories, and settings for their store.
    - Can invite other users to their store.
  - Current Status: Implemented
- **REQ-ROLES-3: Staff**
  - Description: Restricted user role for store operations.
  - Acceptance Criteria:
    - Limited access based on permissions (typically view-only for dashboard).
  - Current Status: Implemented

## 3. Authentication & Session Management
- **REQ-AUTH-1: Session-Based Auth**
  - Description: Secure authentication using Laravel Sanctum cookies.
  - Acceptance Criteria:
    - User stays logged in via httpOnly cookies.
    - Redirect to login on session expiration.
  - Current Status: Implemented ([auth.md](file:///home/leader/projects/laravel/tenant/laratenant-commerce/docs/architecture/auth.md))
- **REQ-AUTH-2: Multi-Tab Synchronization**
  - Description: Auth state is synchronized across multiple browser tabs.
  - Acceptance Criteria:
    - Logging out in one tab logs out all tabs.
    - Login/Store switch is propagated to other tabs.
  - Current Status: Implemented ([auth.spec.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/tests/e2e/auth.spec.ts))

## 4. Onboarding & Store Setup Flow
- **REQ-ONBOARD-1: Verification Gating**
  - Description: Users must verify their email before they can create a store.
  - Acceptance Criteria:
    - Show "Check your inbox" screen after signup.
    - Redirect to setup flow after verification.
  - Current Status: Implemented ([onboarding.spec.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/tests/e2e/onboarding.spec.ts))
- **REQ-ONBOARD-2: First Store Creation**
  - Description: Guided step for creating the initial tenant.
  - Acceptance Criteria:
    - Collect store name and slug.
    - Show provisioning progress after submission.
  - Current Status: Implemented ([SetupOrchestrator.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/setup/components/SetupOrchestrator.tsx))
- **REQ-ONBOARD-3: Infrastructure Provisioning**
  - Description: Real-time feedback during tenant setup.
  - Acceptance Criteria:
    - Display progress bar and current step.
    - Handle timeouts and retries.
  - Current Status: Implemented ([ProvisioningStep.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/setup/components/ProvisioningStep.tsx))

## 5. Multi-Store Management
- **REQ-MS-1: Store Switching**
  - Description: Ability to switch between multiple owned stores.
  - Acceptance Criteria:
    - List available stores in a switcher.
    - Update dashboard context immediately after selection.
  - Current Status: Implemented ([StoreSwitcher.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/dashboard/shell/topbar/StoreSwitcher.tsx))

## 6. Dashboard Overview (Stats & Analytics)
- **REQ-DASH-1: Performance Metrics**
  - Description: Real-time overview of store health.
  - Acceptance Criteria:
    - Show Revenue, Orders, Customers, and AOV.
    - Show Recent Orders list.
  - Current Status: Implemented ([DashboardContent.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/dashboard/dashboard-overview/DashboardContent.tsx))

## 7. Product Management
### 7.1 Product Creation Wizard
- **REQ-PROD-1: Multi-Step Wizard**
  - Description: Guided 4-step creation process.
  - Acceptance Criteria:
    - Steps: Content, Structure, Media, Review.
  - Current Status: Implemented ([CreateProductWizard.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/products/creation/CreateProductWizard.tsx))
### 7.2 Product Editor
- **REQ-PROD-2: Detailed Editing**
  - Description: Interface for updating existing product data.
  - Acceptance Criteria:
    - Tabbed interface for Content, Structure, Media.
  - Current Status: Implemented ([EditProductForm.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/products/editor/components/EditProductForm.tsx))
### 7.3 Variants & Options
- **REQ-PROD-3: Variant Generation**
  - Description: Automatically generate variants from options (Size, Color).
  - Acceptance Criteria:
    - Cartesian product generation.
    - Manage SKU, price, and stock per variant.
  - Current Status: Implemented ([generateVariants.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/products/editor/utils/generateVariants.ts))
### 7.4 Product Media
- **REQ-PROD-4: Image Management**
  - Description: Manage product-level and variant-level images.
  - Acceptance Criteria:
    - Drag-and-drop upload.
    - Reorder images.
  - Current Status: Implemented ([CreateProductMediaStep.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/products/creation/CreateProductMediaStep.tsx))
### 7.5 Product Translations
- **REQ-PROD-5: Localized Content**
  - Description: Manage product names and descriptions in multiple languages.
  - Acceptance Criteria:
    - Toggle between EN and AR tabs.
  - Current Status: Implemented ([LocaleTabs.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/products/editor/components/LocaleTabs.tsx))

## 8. Order Management
- **REQ-ORDER-1: Order Fulfillment**
  - Description: Track and process customer orders.
  - Acceptance Criteria:
    - View order details and items.
    - Update order status (Processing, Shipped, etc.).
  - Current Status: Implemented ([OrderDetailContent.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/dashboard/orders/OrderDetailContent.tsx))

## 9. Category Management
- **REQ-CAT-1: Hierarchical Categories**
  - Description: Organize products into parent/child categories.
  - Acceptance Criteria:
    - Support for nesting.
    - Localized names and slugs.
  - Current Status: Implemented ([CreateCategoryForm.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/dashboard/categories/CreateCategoryForm.tsx))

## 10. Brand Management
- **REQ-BRAND-1: Brand Profiles**
  - Description: Manage product brands.
  - Acceptance Criteria:
    - Logo upload.
    - Active/Inactive toggle.
    - Single name/slug (no localization support).
  - Current Status: Implemented ([CreateBrandForm.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/dashboard/brands/CreateBrandForm.tsx))

## 11. Tag Management
- **REQ-TAG-1: Flexible Labeling**
  - Description: Use tags for products and orders.
  - Acceptance Criteria:
    - Color-coded badges.
  - Current Status: Implemented ([CreateTagForm.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/dashboard/tags/CreateTagForm.tsx))

## 12. User Management (Store Members)
- **REQ-USER-1: Store Invitations**
  - Description: Invite team members to a specific store.
  - Acceptance Criteria:
    - Role assignment (Store Admin, Staff).
  - Current Status: Implemented ([CreateUserDialog.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/dashboard/users/CreateUserDialog.tsx))

## 13. CMS & Marketing Pages
- **REQ-CMS-1: Sections Builder**
  - Description: Build marketing pages using pre-defined blocks.
  - Acceptance Criteria:
    - Blocks: Hero, Pricing, FAQ, Features.
  - Current Status: Implemented ([SectionsBuilder.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/dashboard/cms-pages/components/SectionsBuilder.tsx))

## 14. Store Settings
- **REQ-SET-1: Basic Configuration**
  - Description: Manage store name, slug, and contact info.
  - Acceptance Criteria:
    - Localized settings.
  - Current Status: Implemented ([StoreSettingsForm.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/merchant/settings/StoreSettingsForm.tsx))

## 15. Internationalization (EN/AR)
- **REQ-I18N-1: Multi-Language Support**
  - Description: Fully translated interface.
  - Acceptance Criteria:
    - Support for English and Arabic.
  - Current Status: Implemented ([i18n.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/i18n.ts))
- **REQ-I18N-2: RTL Support**
  - Description: Layout flips for Arabic.
  - Acceptance Criteria:
    - Automatic `dir="rtl"` application.
  - Current Status: Implemented ([LocaleToggle.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/dashboard/shell/topbar/LocaleToggle.tsx))

## 16. Permissions & Access Control
- **REQ-PERM-1: RBAC Enforcement**
  - Description: Functional access restricted by user role.
  - Acceptance Criteria:
    - `useCan` hook in frontend.
    - Server-side validation.
  - Current Status: Implemented ([permissions.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/lib/auth/permissions.ts))
