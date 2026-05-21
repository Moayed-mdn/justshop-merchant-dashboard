# CMS Frontend Architecture

## Purpose

This document describes the current frontend integration for the platform CMS used by marketing pages, blog content, documentation, sitemap, and robots.

## Canonical Modules

- Service layer: `src/services/cms/cms.service.ts`
- Types: `src/types/cms.ts`
- SEO adapter: `src/lib/seo/cms-seo.ts`
- HTML renderer: `src/components/cms/CmsContent.tsx`
- JSON-LD renderer: `src/components/cms/JsonLd.tsx`
- Docs utilities: `src/features/cms/docs/utils/toc.ts`
- Docs UI: `src/features/cms/docs/components/*`
- Blog UI: `src/features/cms/blog/components/*`

## CMS Route Map

- Pages: `/api/v1/public/cms/pages/{slug}`
- Blog index: `/api/v1/public/cms/blog`
- Blog detail: `/api/v1/public/cms/blog/{slug}`
- Docs sidebar: `/api/v1/public/cms/docs/sidebar`
- Docs detail: `/api/v1/public/cms/docs/{slugPath}`
- Sitemap: `/api/v1/public/cms/seo/sitemap/{domain}`
- Robots source: `/api/v1/public/cms/seo/robots.txt`

## Service Layer Rules

- All CMS reads go through `cmsService`.
- `cmsService` is server-oriented and built on `serverFetch`.
- Public content requests use `force-cache` and stable cache tags.
- Keep endpoint definitions, cache tags, and response typing centralized in this service.
- Do not duplicate CMS fetch logic in route files, client hooks, or feature components.

## Rendering Flow

### Marketing Pages
- Marketing routes such as `/`, `/about`, and `/blog` fetch a CMS page payload by slug.
- `generateMetadata()` resolves route metadata from `page.seo`.
- Structured data is rendered with `JsonLd` when `structured_data` exists.
- Rich CMS HTML can be rendered in-page with `CmsContent`.
- Marketing section composition still uses typed frontend sections and locale content files where the implementation has not moved section content into CMS.

### Blog
- Blog index fetches paginated CMS posts plus the `blog` page payload for route-level SEO and structured data.
- Blog detail fetches a single CMS post by slug and renders its HTML through `CmsContent`.
- Blog route metadata is always derived from CMS SEO when the CMS payload is available.

### Documentation
- `docs/layout.tsx` fetches the recursive sidebar tree server-side.
- `DocsSidebar.tsx` renders that tree as a client component for active-state and expand/collapse behavior.
- `docs/[...slug]/page.tsx` fetches the CMS page by slug path.
- `processContentHeadings()` injects deterministic ids into `h2` and `h3` tags and returns TOC data.
- `DocsTableOfContents.tsx` uses those headings for client-side active section tracking.

## SEO Flow

```text
CMS seo payload
  -> buildMetadataFromSeo()
  -> Next.js Metadata
  -> rendered head metadata

CMS structured_data
  -> JsonLd
  -> server-rendered script tag
```

- The SEO contract is typed by `SeoPayload` in `src/types/cms.ts`.
- Canonical url, alternates, robots, Open Graph, and Twitter metadata all come from that CMS payload.
- CMS SEO is the source of truth for public route metadata, not handwritten per-page metadata objects.

## Sidebar and TOC Architecture

- Sidebar data is recursive and typed as `DocumentationSidebarNode[]`.
- Sidebar route paths use `slug_path` from CMS instead of locally assembled nested route maps.
- TOC heading extraction is server-side so the HTML and anchor ids are deterministic before hydration.
- TOC scroll observation is client-side only.

## Cache and Revalidation Strategy

- Public CMS fetches use `force-cache` with stable `next.tags` keys.
- Tags include route-specific keys like `cms-page-home`, `cms-blog-post-{slug}`, and `cms-docs-page-{slugPath}` plus shared keys like `cms-blog-posts` and `cms-docs-sidebar`.
- This keeps public CMS caching compatible with App Router tag-based revalidation without spreading cache concerns across pages.
- `getSitemap()` intentionally uses `no-store` because sitemap freshness requirements differ from cached CMS pages.

## Payload and Serialization Rules

- CMS timestamps remain typed as strings and are treated as ISO-8601 API values.
- Rendering code formats timestamps for display but must not mutate or reinterpret the contract shape.
- CMS HTML rendering must remain deterministic and hydration-safe.
- Do not mix browser-only transforms into the server-rendered CMS HTML path.

