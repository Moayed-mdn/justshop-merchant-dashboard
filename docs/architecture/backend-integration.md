# Backend Integration

## Integration Model

- Backend is Laravel and remains the source of truth for API and CMS payloads.
- Server Components call Laravel directly through `serverFetch` in `src/lib/api/server.ts`.
- Browser-side interactive requests go through the internal Next.js proxy route at `src/app/api/proxy/route.ts`.
- Public CMS content is a platform-level Laravel concern exposed under `/api/v1/public/cms/*`.
- The backend API is organized into explicit application contexts: `merchant`, `platform`, `storefront`, and `customer`.

## API Context Structure

| Context | Prefix | Purpose |
| :--- | :--- | :--- |
| Merchant | `/api/v1/merchant/` | Auth, profile, store management for merchant users |
| Platform | `/api/v1/platform/` | Super-admin / platform-level operations |
| Storefront | `/api/v1/storefront/stores/{store}/` | Public-facing storefront product/cart/order reads |
| Customer | `/api/v1/customer/` | Customer account operations |
| Public CMS | `/api/v1/public/cms/` | Unauthenticated CMS content |

ALL legacy routes under `/api/v1/admin/`, `/api/v1/users/`, and `/api/v1/me` have been removed in favor of the canonical context architecture.

## Merchant Store Identifier Migration

The current merchant API contract still uses `stores/{store}` for store-scoped operations. The intended cleanup is to make the public `{store}` segment resolve by store slug instead of exposing numeric IDs in dashboard-facing URLs.

This is a route-key migration only:

- Public URL segment target: `stores/{storeSlug}`
- Internal authorization and repository scoping: keep `store_id`
- Bootstrap/session state: keep `active_store_id` and `last_active_store_id`

### Routes That Should Move To Slug

These routes are merchant-facing and currently generate `stores/{storeId}` from the dashboard. They should move to `stores/{storeSlug}` once backend route resolution is updated.

| Route Family | Current Pattern |
| :--- | :--- |
| Store detail/settings | `/api/v1/merchant/stores/{store}` |
| Provisioning status | `/api/v1/merchant/stores/{store}/provisioning-status` |
| Dashboard metrics | `/api/v1/merchant/stores/{store}/dashboard/*` |
| Products | `/api/v1/merchant/stores/{store}/products/*` |
| Orders | `/api/v1/merchant/stores/{store}/orders/*` |
| Categories | `/api/v1/merchant/stores/{store}/categories/*` |
| Brands | `/api/v1/merchant/stores/{store}/brands/*` |
| Tags | `/api/v1/merchant/stores/{store}/tags/*` |
| Users/customers | `/api/v1/merchant/stores/{store}/users/*` |
| Navigation | `/api/v1/merchant/stores/{store}/navigation/*` |
| Assets | `/api/v1/merchant/stores/{store}/assets/*` |
| Themes | `/api/v1/merchant/stores/{store}/themes/*` |
| Page templates | `/api/v1/merchant/stores/{store}/templates/*` |
| Store CMS | `/api/v1/merchant/stores/{store}/cms/pages/*` |
| CMS section metadata | `/api/v1/merchant/stores/{store}/cms/section-types` |
| Section schemas | `/api/v1/merchant/stores/{store}/section-schemas` |
| Shipping | `/api/v1/merchant/stores/{store}/shipping/*` |

### Routes That Stay Unchanged

These are not part of the slug migration and should remain as they are:

| Route / Contract | Why It Stays |
| :--- | :--- |
| `POST /api/v1/merchant/stores` | Store does not exist yet; slug is created here |
| `POST /api/v1/merchant/stores/validate-slug` | Slug validation endpoint, not a store-scoped route |
| `GET /api/v1/merchant/stores/slug-check` | Slug availability endpoint, not a store-scoped route |
| `PATCH /api/v1/merchant/auth/active-store` with `store_id` | Session/bootstrap persistence remains ID-based internally |
| Bootstrap fields like `active_store_id` | Internal operational state should keep numeric IDs |

### Out Of Scope For This Migration

- `storefront` routes under `/api/v1/storefront/stores/{store}/...`
- backend repository and DTO rules that require `storeId` internally
- platform and public CMS routes that do not use merchant store context

## Public CMS Boundary

- Frontend CMS access is centralized in `src/services/cms/cms.service.ts`.
- Do not call CMS endpoints directly from route files or components.
- Current public CMS endpoints used by the frontend include:
  - `/api/v1/public/cms/pages/{slug}`
  - `/api/v1/public/cms/blog`
  - `/api/v1/public/cms/blog/{slug}`
  - `/api/v1/public/cms/docs/sidebar`
  - `/api/v1/public/cms/docs/{slugPath}`
  - `/api/v1/public/cms/seo/sitemap/{domain}`
  - `/api/v1/public/cms/seo/robots.txt`
- These endpoints return normalized SEO and content payloads consumed by the App Router frontend.

## Server Path

- `serverFetch` forwards cookies from `next/headers` to Laravel.
- `serverFetch` forwards locale through `Accept-Language`.
- Default cache mode is `no-store`, but callers can opt into `force-cache` and `next.tags` for public CMS reads.
- Non-2xx responses are normalized into `ApiError` and thrown.

## Client Path

- Browser code uses `clientFetch` or feature API helpers that target `/api/proxy`.
- `/api/proxy` forwards cookies, locale resolution, request body, and XSRF token for non-GET requests.
- `/api/proxy` relays upstream body, status, and `set-cookie` headers back to the browser.

## SEO Infrastructure

- CMS SEO payloads are adapted in `src/lib/seo/cms-seo.ts`.
- `src/app/sitemap.ts` maps CMS sitemap entries into `MetadataRoute.Sitemap`.
- `src/app/robots.ts` resolves robots infrastructure on the server and falls back safely if CMS retrieval fails.
- Do not reimplement sitemap, robots, or metadata shaping in route-local code.

## Rules

- Never bypass the shared API layer.
- Never fetch Laravel directly from browser components.
- Keep public CMS calls in `cms.service.ts`.
- Keep server/client transport responsibilities separate.
