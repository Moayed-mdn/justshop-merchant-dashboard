# API Layer Standards

## Canonical Layers

- Route and feature code must consume canonical API helpers, not ad-hoc `fetch` calls.
- `serverFetch` owns server-to-Laravel transport.
- `clientFetch` owns browser-to-`/api/proxy` transport.
- `cmsService` owns public CMS endpoint access.
- Shared transport normalization lives in `src/lib/api/core/transport.ts`.

## Public CMS Conventions

- Keep all `/api/v1/public/cms/*` endpoint access in `src/services/cms/cms.service.ts`.
- Reuse shared CMS types from `src/types/cms.ts`.
- Keep cache tags and endpoint strings centralized in the service.
- Route files may orchestrate fallback behavior, but they must not recreate service logic.

## Runtime Boundaries

- Server Components, route handlers, and metadata helpers use `serverFetch` or higher-level server services.
- Browser code uses `clientFetch` or feature API modules built on it.
- `/api/proxy` remains the browser bridge for cookie-session auth and locale/XSRF forwarding.
- Do not fetch Laravel directly from browser code.

## SEO Adapter Boundary

- CMS SEO payload shaping belongs in `src/lib/seo/cms-seo.ts`.
- Route files should call `buildMetadataFromSeo()` instead of assembling Metadata objects field by field.
- Structured data rendering belongs in `src/components/cms/JsonLd.tsx` or other canonical route-level helpers.
- Do not duplicate CMS SEO mapping logic across marketing, blog, and docs routes.

## Raw Fetch Policy

- Raw `fetch` is allowed only in canonical transport layers, `/api/proxy`, or equivalent shared infrastructure with a clear architectural reason.
- CMS route files should not use raw `fetch` for public content.
- New service wrappers require a real runtime boundary, not feature-level preference.

