# LaraTenant Commerce Requirements Summary

---

## Quick Project Description

LaraTenant Commerce is a multi-tenant ecommerce platform that enables merchants to manage multiple online stores, products, and orders through a single, unified dashboard. Built on a modern headless architecture with Next.js (frontend) and Laravel (backend), it prioritizes scalability, security, and multi-lingual support (English and Arabic, including RTL layout). Merchants can sign up, verify their email, create stores with real-time provisioning, and manage their entire commerce operations from inventory to order fulfillment.

The platform's key differentiator is its tenant isolation model, where each store operates as an independent tenant with strict data separation, while still providing a seamless multi-store management experience through a single login. It uses a workspace-centric routing approach (transitioning from legacy storeId-in-URL) and leverages modern frontend patterns like React Server Components (RSC), React Query for state management, and Zustand for lightweight UI state.

---

## Architecture Summary

- **Frontend Stack**: Next.js 15+ App Router, shadcn/ui components, TypeScript, Tailwind CSS
- **Backend Stack**: Laravel (PHP), Sanctum for session auth
- **Multi-Tenancy**: Tenant per store, resolved from active session/context
- **State Management**: React Query (server state), Zustand (client/UI state)
- **API Layer**: Next.js proxy route (`/api/proxy`) for client requests, server-side fetching for RSC
- **Authentication**: httpOnly cookies via Sanctum, no tokens in localStorage
- **Internationalization**: next-intl with EN/AR, RTL layout support
- **Testing**: Playwright E2E with stateful mock backend
- **Routing**: Migration from `/stores/[storeId]/*` to canonical `/merchant/*`

---

## Feature Count by Status

From `FEATURE_STATUS.md`:

| Status | Count |
| :--- | :--- |
| ✅ Fully Implemented | 20+ features (auth, dashboard, product list/editor, orders, brands, tags, users, CMS, i18n, RTL) |
| 🟡 Partially Implemented | 5+ (password reset tests, variant media, categories, product browse, E2E coverage) |
| 🔴 Has Known Issues | 4+ (canonical routing creation sub-routes, product wizard, categories, provisioning UI) |
| ❌ Not Started | 2+ (product search, cart/checkout) |

---

## Top 5 Critical Gaps That Need Fixing NOW

1. **Canonical Route Creation Pages (404s)**: Fix `/merchant/products/new`, `/merchant/categories/new`, and `/merchant/stores/create` to resolve 404 errors. These are blocking basic merchant workflows.
2. **Additional Store Creation**: The "Create store" link on the stores list page is not working (timeout/404), preventing merchants from adding more stores.
3. **E2E Test Stability**: Stabilize the merchant creation flows E2E tests to pass consistently with canonical routes.
4. **Variant Media Assignment**: Add UI to allow assigning specific images to product variants (e.g., Red image to Red variant).
5. **Password Reset E2E Coverage**: Add Playwright tests for forgot/reset password flows to prevent regression.

---

## Recommended Development Roadmap (Next 3 Sprints)

### Sprint 1: Unblock Core Merchant Flows
- Fix canonical route creation pages (404s)
- Fix additional store creation flow
- Stabilize E2E tests
- Update sidebar to use canonical `/merchant/` routes

### Sprint 2: Enhance Product System & Storefront
- Implement per-variant media assignment
- Add basic storefront product catalog UX
- Start checkout flow frontend implementation
- Add password reset E2E tests

### Sprint 3: Polish & Expand
- Implement global media library
- Add bulk operations for products
- Enhance CMS with interactive blocks
- Remove remaining legacy route components

---

## Links to Requirements Files

| File | Description |
| :--- | :--- |
| [FUNCTIONAL_REQUIREMENTS.md](./FUNCTIONAL_REQUIREMENTS.md) | Detailed functional requirements with user roles, features, and verification notes |
| [USER_STORIES.md](./USER_STORIES.md) | User-centric stories organized by epics (onboarding, products, orders, etc.) |
| [TECHNICAL_REQUIREMENTS.md](./TECHNICAL_REQUIREMENTS.md) | Technical architecture, routing, API, state management, and security specs |
| [GAPS_AND_ISSUES.md](./GAPS_AND_ISSUES.md) | Known gaps, incomplete features, bugs, and technical debt |
| [FEATURE_STATUS.md](./FEATURE_STATUS.md) | Matrix of all features with current implementation status and notes |
