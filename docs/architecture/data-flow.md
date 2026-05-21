# Data Flow

## Public CMS Read Path

```text
App Router route or generateMetadata()
  -> cmsService
  -> serverFetch
  -> Laravel public CMS API
  -> typed CMS payload
  -> metadata adapter / CMS renderer / route UI
```

- Marketing routes fetch CMS page payloads for page-level metadata, structured data, and optional rich content.
- Blog routes fetch paginated post collections or individual posts from CMS.
- Docs layout fetches the recursive sidebar tree from CMS.
- Docs page routes fetch CMS HTML by slug path and preprocess headings before render.

## Dashboard and Interactive Path

```text
Client hook / client component
  -> clientFetch
  -> /api/proxy
  -> Laravel API
```

- Interactive tables, filters, and mutations stay in client hooks.
- URL state stays in the URL via `nuqs` where that pattern already exists.
- Proxy responsibilities stay limited to browser-session transport concerns.

## Metadata and SEO Flow

```text
CMS seo payload
  -> buildMetadataFromSeo()
  -> Next.js Metadata API
  -> route-level metadata output

CMS structured_data
  -> JsonLd
  -> server-rendered script tag
```

- CMS SEO is the canonical source for public route metadata.
- Do not build alternate metadata shapes in page sections.
- JSON-LD must stay synchronized with visible page content and CMS payload meaning.

## Docs Rendering Flow

```text
Docs layout
  -> cmsService.getDocsSidebar()
  -> recursive sidebar tree
  -> DocsSidebar client renderer

Docs page
  -> cmsService.getDocsPage(slugPath)
  -> processContentHeadings()
  -> CmsContent + DocsTableOfContents
```

- Heading extraction happens on the server for deterministic ids.
- TOC state and scroll tracking happen in the client component only.
- Recursive sidebar structure comes from CMS, not hardcoded frontend nav data.

## Cache Behavior

- Public CMS reads use `force-cache` with stable tags such as `cms-page-{slug}`, `cms-blog-posts`, `cms-docs-sidebar`, and `cms-docs-page-{slugPath}`.
- Sitemap requests are intentionally fresher and use `no-store`.
- The frontend is prepared for tag-based revalidation by keeping cache keys and tags centralized in `cms.service.ts`.

## Error Path

- `serverFetch` throws normalized `ApiError` for failed upstream calls.
- Public routes either fall back gracefully for optional CMS payloads or call `notFound()` for missing CMS resources.
- Avoid swallowing CMS contract problems in shared helpers; keep fallback behavior explicit at the route level.

