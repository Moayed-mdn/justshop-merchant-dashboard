# Technical Requirements

## 1. Frontend Architecture
- **TREQ-FRONT-1: App Router Implementation**
  - Description: Use Next.js 15+ App Router for routing and rendering.
  - Acceptance Criteria:
    - Maximize use of Server Components (RSC).
    - Maintain clean Client/Server boundaries.
  - Current Status: Implemented
- **TREQ-FRONT-2: Shared Component Library**
  - Description: Unified UI primitives based on `shadcn/ui`.
  - Acceptance Criteria:
    - Reusable form, layout, and feedback components.
  - Current Status: Implemented

## 2. Routing & Navigation
- **TREQ-ROUTE-1: Canonical Workspace Paths**
  - Description: Transition from store-id-in-URL to active-store context.
  - Acceptance Criteria:
    - Primary routes: `/merchant/*`.
    - Context resolved from session/state.
  - Current Status: Implemented ([workspace-routing-architecture.md](file:///home/leader/projects/laravel/tenant/laratenant-commerce/docs/frontend/workspace-routing-architecture.md))
- **TREQ-ROUTE-2: Legacy Compatibility**
  - Description: Support for old `/stores/[storeId]/*` paths.
  - Acceptance Criteria:
    - Automatic redirection to canonical routes.
    - Synchronized store switching on access.
  - Current Status: Implemented ([LegacyLayoutRedirector.tsx](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/features/merchant/components/LegacyLayoutRedirector.tsx))

## 3. API Integration Layer
- **TREQ-API-1: Unified Fetch Transport**
  - Description: Shared utilities for server and client requests.
  - Acceptance Criteria:
    - `serverFetch` for RSC (direct backend calls).
    - `clientFetch` for browser (via proxy).
  - Current Status: Implemented ([transport.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/lib/api/core/transport.ts))
- **TREQ-API-2: Next.js API Proxy**
  - Description: Route all client-side requests through `/api/proxy`.
  - Acceptance Criteria:
    - Handle cookie forwarding and XSRF protection.
  - Current Status: Implemented ([route.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/app/api/proxy/route.ts))

## 4. State Management
- **TREQ-STATE-1: Server State Management**
  - Description: Use React Query for all data fetching and caching.
  - Acceptance Criteria:
    - Centralized `queryKeys`.
    - Predictive background revalidation.
  - Current Status: Implemented ([queryClient.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/lib/queryClient.ts))
- **TREQ-STATE-2: Client UI State**
  - Description: Use Zustand for lightweight global state.
  - Acceptance Criteria:
    - Manage bootstrap data, active store, and UI flags.
  - Current Status: Implemented ([bootstrapStore.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/src/stores/bootstrapStore.ts))

## 5. Authentication & Security
- **TREQ-SEC-1: Session-Based Auth**
  - Description: Secure auth via httpOnly cookies (Laravel Sanctum).
  - Acceptance Criteria:
    - No tokens in JavaScript-accessible storage.
  - Current Status: Implemented ([ADR-001](file:///home/leader/projects/laravel/tenant/laratenant-commerce/docs/decisions/ADR-001-httpOnly-auth.md))
- **TREQ-SEC-2: XSRF Protection**
  - Description: Validate all mutations via XSRF tokens.
  - Acceptance Criteria:
    - Proxy injects `X-XSRF-TOKEN` header.
  - Current Status: Implemented

## 6. Multi-Tenancy Implementation
- **TREQ-TENANT-1: Store Isolation**
  - Description: Ensure data from different tenants never leaks.
  - Acceptance Criteria:
    - All API calls must include `store_id` (enforced by backend).
    - Frontend context derived strictly from active session.
  - Current Status: Implemented ([multi-tenancy.md](file:///home/leader/projects/laravel/tenant/laratenant-commerce/docs/architecture/multi-tenancy.md))

## 7. Performance Requirements
- **TREQ-PERF-1: RSC-First Data Fetching**
  - Description: Minimize client-side waterfalls by fetching on the server.
  - Acceptance Criteria:
    - Initial page data loaded in Server Components.
  - Current Status: Implemented
- **TREQ-PERF-2: Asset Optimization**
  - Description: Automatic image and font optimization.
  - Acceptance Criteria:
    - Use `next/image` and optimized font loading.
  - Current Status: Implemented

## 8. Error Handling
- **TREQ-ERR-1: Global Unauthorized Handler**
  - Description: Centralized recovery for 401 errors.
  - Acceptance Criteria:
    - Detect 401 in `clientFetch` and redirect to login.
  - Current Status: Implemented

## 9. Testing Requirements
- **TREQ-TEST-1: E2E Automation**
  - Description: Use Playwright for critical path verification.
  - Acceptance Criteria:
    - Coverage for Auth, Onboarding, and Store Switching.
  - Current Status: Implemented ([playwright.config.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/playwright.config.ts))
- **TREQ-TEST-2: Stateful Mock API**
  - Description: Test isolated frontend logic via a mock backend.
  - Acceptance Criteria:
    - In-memory state with health checks.
  - Current Status: Implemented ([server.ts](file:///home/leader/projects/laravel/tenant/laratenant-commerce/tests/e2e/mock-backend/server.ts))

## 10. Build & Deployment
- **TREQ-BUILD-1: Environment Configuration**
  - Description: Support for multiple deployment environments.
  - Acceptance Criteria:
    - Use `.env` for API URLs and feature flags.
  - Current Status: Implemented
