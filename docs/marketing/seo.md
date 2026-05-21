# Marketing SEO Standards

## Source of Truth

- Public marketing, blog, and docs SEO is CMS-driven.
- The canonical SEO adapter is `src/lib/seo/cms-seo.ts`.
- Route-level structured data is rendered through `src/components/cms/JsonLd.tsx`.
- Do not maintain parallel handwritten metadata systems for public CMS routes.

## Metadata Flow

```text
Laravel CMS SEO payload
  -> cmsService
  -> buildMetadataFromSeo()
  -> Next.js Metadata API
  -> rendered route metadata
```

- Route files define `generateMetadata()` and fetch the CMS payload on the server.
- `buildMetadataFromSeo()` maps canonical url, alternates, robots, Open Graph, and Twitter fields into `Metadata`.
- Do not inject ad-hoc `<head>` tags from sections or client components.

## Current Public SEO Surface

- Marketing routes such as `/`, `/about`, and `/blog` read CMS page SEO by slug.
- Blog detail routes read SEO from the blog post payload.
- Docs detail routes read SEO from the documentation page payload.
- `src/app/sitemap.ts` is centralized and maps CMS sitemap entries into `MetadataRoute.Sitemap`.
- `src/app/robots.ts` is centralized and resolves robots infrastructure server-side with a safe fallback.

## Locale and Canonical Rules

- All public routes are locale-first under `/{locale}`.
- Locale alternates come from the CMS SEO payload and flow into `metadata.alternates.languages`.
- Canonical URLs must come from the normalized CMS payload, not route-local string building.
- Keep `metadataBase` resolution centralized in `src/app/[locale]/layout.tsx`.

## JSON-LD Rules

- Render JSON-LD server-side at the route level only.
- Use CMS `structured_data` when the payload provides it.
- Keep JSON-LD synchronized with visible CMS content and route identity.
- Avoid route-local JSON-LD duplication when CMS already provides the structured payload.
- Inline JSON-LD must serialize deterministically with `JSON.stringify`.

## Hybrid Marketing Rule

- Marketing section copy still exists partly in typed frontend content files.
- CMS currently owns route-level SEO and may also provide page body HTML.
- Do not describe the public site as static JSON-driven; the active SEO system is CMS-backed.
- Do not claim every visual section is block-rendered from CMS unless the route actually implements that behavior.

## Rendering Rules

- Keep public SEO resolution in Server Components and `generateMetadata()`.
- Do not fetch SEO client-side.
- Keep public CMS reads cache-tagged through `cmsService`.
- Avoid non-deterministic metadata values derived differently on server and client.

