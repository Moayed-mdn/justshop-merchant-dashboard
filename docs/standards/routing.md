# Routing Standards

## Core Rules

- All user-facing routes are locale-aware under `/{locale}`.
- Tenant dashboard routes are scoped under `stores/[storeId]`.
- Use navigation helpers and route config; avoid hardcoded user-facing route strings when a shared helper exists.
- Keep page ownership in the filesystem. Do not reintroduce app-type routing through middleware headers.

## Public CMS Route Rules

- Marketing, blog, and docs routes live in `src/app/[locale]/(marketing)`.
- Use App Router dynamic segments for CMS-backed routes:
  - blog detail: `blog/[slug]`
  - docs detail: `docs/[...slug]`
- Build docs paths from CMS `slug_path`, not from duplicated local sidebar definitions.
- The docs root route redirects to the first CMS sidebar entry instead of maintaining a hardcoded landing slug.

## Metadata and Locale Rules

- Route-level `generateMetadata()` must resolve locale-aware metadata on the server.
- Locale alternates come from the CMS SEO payload and map into Next.js metadata alternates.
- `src/app/[locale]/layout.tsx` owns locale static params and `metadataBase` resolution.
- Do not hardcode production hostnames inside route files.

## Dynamic Route Guardrails

- Catch-all docs routes must treat slug arrays as canonical CMS slug paths.
- Dynamic routes should call `notFound()` for missing CMS resources instead of inventing local fallbacks.
- Keep route params typed and awaited in App Router server files.
- Keep route files thin and route-specific; move shared logic into services and helpers.

