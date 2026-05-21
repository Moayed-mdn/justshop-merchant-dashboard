# AI Project State: LaraTenant Commerce

This document maintains the permanent architectural and state memory for the LaraTenant Commerce platform.

## Platform Overview
LaraTenant Commerce is a high-performance, production-grade, multilingual multi-tenant commerce platform built with a Laravel backend and a Next.js App Router frontend. It is designed to scale from small stores to large enterprise commerce ecosystems.

## Architecture Summary

### Backend Architecture (LOCKED Patterns)
- **Framework**: Laravel 11+
- **Pattern**: Action-based architecture (Logic isolated in Actions, not Controllers).
- **Data Flow**: Request -> Controller -> Action -> Repository -> DTO -> Resource.
- **Multitenancy**: Store-scoped isolation for all commerce entities (Products, Orders, etc.).
- **CMS**: Platform-level content system (non-tenant scoped) for Marketing, Blog, and Docs.
- **API**: Strongly typed JSON API via Laravel Resources and DTOs.

### Frontend Architecture (STABLE Patterns)
- **Framework**: Next.js 15+ (App Router).
- **Rendering**: SSR-first, RSC-first, with ISR for CMS pages.
- **Data Fetching**:
    - **Server Components**: Direct fetching via `serverFetch` (RSC-safe).
    - **Client Components**: React Query for interactive dashboard state.
- **State Management**: Zustand for UI state; React Query for server state.
- **Styling**: Tailwind CSS + shadcn/ui.

## Core Systems

### Multitenancy Model
- **Platform Level**: Marketing, Blog, Docs, Auth, Store Creation.
- **Tenant Level**: Dashboard (`/stores/[storeId]/*`), Storefront (future).
- **Routing**: `[locale]` prefix for all routes; `[storeId]` for dashboard routes.

### CMS Architecture
- **Scope**: Platform-level (NOT store-scoped).
- **Endpoints**: `/api/v1/public/cms/*`.
- **Entities**: MarketingPage, BlogPost, DocumentationPage.
- **Recursive Docs**: Recursive sidebar tree structure with slug-path routing.
- **Reading UX**: Automatic TOC extraction, active heading tracking, smooth scroll.

### SEO & Metadata
- **Centralized Adapter**: `src/lib/seo/cms-seo.ts` transforms CMS payloads to Next.js Metadata.
- **Structured Data**: `JsonLd` component for standard-compliant LD+JSON injection.
- **Localized**: Full support for `alternates` (hreflang) and `x-default`.

### Localization
- **Framework**: `next-intl` (Server & Client).
- **Support**: Bi-directional (LTR/RTL) with specific prose overrides for RTL.
- **Routing**: Locale-prefix strategy (`/en`, `/ar`).

### Commerce Core
- **Variant-First**: Products are modeled around variants from the start.
- **Taxonomy**: Hierarchical categories, brands, and tags.
- **Order Flow**: Multi-status order management with line-item detail.

## Engineering Decisions & Constraints

### Completed Systems
- **CMS Foundation**: Marketing, Blog, Docs (Recursive).
- **SEO Layer**: Metadata API integration + JsonLd.
- **Dashboard Shell**: Multi-tenant aware sidebar, topbar, locale/theme toggles.
- **Entity Management**: Brands, Categories, Tags, Orders, Users (Full CRUD).

### Systems In Progress
- **Product Editor**: Advanced multi-step wizard and complex variant management.
- **Storefront**: Initial architecture preparation.

### Forbidden Patterns
- **No `any`**: Strict TypeScript only.
- **No `useEffect` Fetching**: Do not fetch CMS data in client components.
- **No Parallel Architectures**: Do not bypass the `serverFetch`/`clientFetch` layer.
- **No Hardcoded Routes**: Use centralized routing logic.

### Technical Debt
- **Component Bloat**: Some dashboard forms are becoming large; future refactor to smaller atoms needed.
- **Test Coverage**: Dashboard components need more integration tests.

## Future Roadmap
1. Complete Product Editor stabilization.
2. Launch Storefront rendering engine.
3. Implement advanced Analytics dashboard.
4. Scale CMS to support multi-region landing pages.
