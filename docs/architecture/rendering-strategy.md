# Rendering Strategy

## Default Model

- The application is server-first.
- App Router route files are Server Components unless a file explicitly opts into `'use client'`.
- Route-level data reads and metadata generation happen on the server.
- Client Components are used only where browser state, effects, or event handling are required.

## Public Rendering Modes

- Public CMS reads for marketing pages, blog pages, blog posts, docs sidebar, and docs pages use `force-cache` plus stable cache tags in `src/services/cms/cms.service.ts`.
- This creates a hybrid SSR/ISR-style model in App Router: content is rendered on the server from cached CMS responses and prepared for tag-based revalidation.
- `sitemap.ts` stays fresh by using `no-store` in the CMS service instead of cached public content rules.
- `robots.ts` resolves server-side from CMS-backed infrastructure with a safe fallback object.

## Metadata Flow

- Marketing, blog, and docs routes define `generateMetadata()` in the route file.
- `generateMetadata()` fetches CMS SEO payloads through `cmsService`.
- `src/lib/seo/cms-seo.ts` maps the CMS SEO contract into the Next.js Metadata API.
- JSON-LD is rendered in the page body through `src/components/cms/JsonLd.tsx`.
- Do not generate metadata in child sections or client components.

## Docs and Blog Rendering

- Blog index is a server route that fetches paginated posts plus the `blog` CMS page for route-level SEO and structured data.
- Blog post routes fetch a CMS post by slug, generate metadata from `post.seo`, and render CMS HTML content server-side.
- Docs layout fetches the recursive sidebar server-side once per request/render path.
- Docs page routes fetch the CMS page by slug path, derive metadata from CMS SEO, process headings server-side, and render TOC/sidebar around deterministic HTML output.

## RSC Boundaries

- Keep pages and layouts server-side when they only orchestrate data and composition.
- Keep interactive docs navigation in client files such as `DocsSidebar.tsx` and `DocsTableOfContents.tsx`.
- Do not move fetch logic into client components for public CMS content.
- Do not import client hooks or browser APIs into CMS route files or metadata helpers.

## Determinism Rules

- CMS HTML rendering must be hydration-safe and deterministic between server and client.
- Heading ids for docs are derived server-side by `processContentHeadings()` before rendering.
- Published and updated dates must remain ISO-8601 strings from the API and be formatted only at render time.
- Avoid request-time randomness, browser-only branching, or non-deterministic HTML transforms in CMS page output.

