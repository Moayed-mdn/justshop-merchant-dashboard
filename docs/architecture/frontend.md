# Frontend Architecture

## Runtime Shape

- App Router is locale-first under `src/app/[locale]`.
- Route groups separate public marketing, auth, dashboard, and legacy storefront concerns.
- Protected dashboard UI lives in `src/app/[locale]/(dashboard)/stores/[storeId]`.
- Public marketing, blog, and docs live in `src/app/[locale]/(marketing)`.
- Pages remain thin server-side orchestrators and delegate UI to `src/features/*` and shared components.

## Public CMS Surface

- Frontend CMS integration is centralized in `src/services/cms/cms.service.ts`.
- CMS reads use the Laravel public CMS API under `/api/v1/public/cms/*`.
- Public CMS routes currently power:
  - marketing page payloads such as `home`, `about`, and `blog`
  - blog index and blog post content
  - documentation sidebar and documentation pages
  - sitemap and robots inputs
- SEO payload adaptation is centralized in `src/lib/seo/cms-seo.ts`.
- Structured data rendering is centralized in `src/components/cms/JsonLd.tsx`.

## Core Providers

- Locale layout `src/app/[locale]/layout.tsx` wires:
  - `NextIntlClientProvider`
  - `NuqsAdapter`
  - `QueryProvider`
  - global `Toaster`
- Locale layout also defines `generateStaticParams()` for supported locales and resolves `metadataBase` from request headers or `NEXT_PUBLIC_SITE_URL`.
- Root app layout `src/app/layout.tsx` owns document-level shell concerns.

## Rendering Model

- Route `page.tsx` and `layout.tsx` files are Server Components by default.
- Route-level `generateMetadata()` runs on the server and resolves CMS SEO before render.
- Public CMS content is fetched on the server with `serverFetch` and cached with stable tags.
- Client Components are reserved for interactivity such as docs sidebar state and TOC scroll tracking.

## Marketing, Blog, and Docs

- Marketing routes are App Router server components with CMS-backed metadata and optional CMS body content.
- Marketing section composition still uses typed frontend sections and locale content files where the code has not moved that content into CMS.
- Blog posts and docs pages render CMS HTML through `src/components/cms/CmsContent.tsx`.
- Docs layout resolves recursive sidebar data server-side, then hands it to a client sidebar renderer for expand/collapse state.
- Docs pages preprocess headings server-side to produce deterministic anchor ids and a client TOC.

## UI Boundaries

- `components/ui/*`: shared low-level primitives.
- `components/shared/*`: cross-feature reusable business-agnostic components.
- `components/cms/*`: shared CMS rendering primitives.
- `features/cms/*`: CMS-specific page UI such as blog lists, docs sidebar, and TOC.
- `features/marketing/*`: public-site layouts, sections, and typed content resolvers.
- Avoid cross-feature imports except through shared primitives or canonical services.

