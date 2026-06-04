# Technical Requirements — LaraTenant Commerce

## Architecture Requirements
- **Decoupled Stack**: Headless Laravel 11+ backend providing a JSON API and a Next.js 15+ (App Router) frontend for rendering.
- **Multi-Tenancy**: 
  - Tenant resolution must be URL-driven (`/merchant/*` canonical or `/stores/[id]/*` legacy).
  - Backend must enforce strict `store_id` scoping for all commerce data.
- **Rendering Strategy**: 
  - Prefer Server Components (RSC) for data fetching and initial rendering.
  - Client Components must be isolated to interactive "leaves" of the component tree.

## API Integration Requirements
- **Unified Transport Layer**: All communication must use the shared `serverFetch` (for RSC) or `clientFetch` (for browser) utilities.
- **Internal API Proxy**: Browser-side requests must route through the Next.js `/api/proxy` to handle:
  - Sanctum session cookie forwarding.
  - XSRF-TOKEN injection for state-changing requests.
  - Development-environment cookie normalization.
- **Data Mapping**: Raw API responses must be transformed into structured domain types via dedicated mappers.

## State Management Requirements
- **Server State**: Managed exclusively via React Query (TanStack Query).
  - Centralized `queryKeys` factory for cache consistency.
  - Default `staleTime` and `gcTime` policies to minimize redundant fetches.
- **Global UI/Session State**: Managed via Zustand.
  - `bootstrapStore`: Primary source of truth for user profile, permissions, and onboarding status.
  - `storeStore`: Active store context and tenant metadata.
  - `uiStore`: Presentation-level flags (RTL/LTR, sidebar state).

## Routing Requirements
- **Locale-First Routing**: All paths must be prefixed with the active locale (`/en`, `/ar`).
- **Canonical Workspace**: Implement `/merchant/*` routes where store identity is derived from session context rather than the URL.
- **Legacy Compatibility**: Maintain `/stores/[storeId]/*` routes using redirectors to preserve existing deep links.

## Security Requirements
- **Authentication**: Cookie-based session auth via Laravel Sanctum. No tokens in `localStorage`.
- **CSRF Protection**: Mandatory XSRF-TOKEN validation for all non-GET requests.
- **Middleware Guard**: Centralized middleware to protect dashboard routes and handle tenant resolution.
- **Permissions**: Role-based access control (RBAC) enforced by both backend API and frontend `useCan` hooks.

## Internationalization (i18n) Requirements
- **Bi-Directional Support**: Full LTR (English) and RTL (Arabic) layout compatibility.
- **Namespace-Based Translations**: Organized by module (common, dashboard, products, etc.) in JSON files.
- **Key Parity**: Automated scripts to ensure all keys exist across supported locales.

## Testing Requirements
- **E2E Testing**: Comprehensive Playwright suites covering critical user journeys (Auth, Onboarding, Creation Wizard, Store Switching).
- **Mock Environment**: Stateful Node.js mock backend for isolated frontend testing without requiring a live Laravel environment.
- **Environment Parity**: Tests must run against the same production-like URL structures (locale prefixes, canonical routes).

## Performance Requirements
- **Asset Optimization**: Automatic image optimization and selective font loading.
- **Bundle Efficiency**: Minimize client-side bundle size by maximizing RSC usage.
- **Responsive Design**: Mobile-first layouts with adaptive navigation (collapsible sidebar, mobile overlays).
