# Marketing Component Architecture

## Current Shape

- Public marketing routes live in `src/app/[locale]/(marketing)`.
- Marketing pages are server-first route components.
- Route files own `generateMetadata()`, CMS page fetches, and top-level section composition.
- Reusable section and layout primitives live in `src/features/marketing/*`.
- Shared CMS renderers live in `src/components/cms/*` and CMS-specific UI in `src/features/cms/*`.

## Content Architecture

- The public site is no longer a static JSON-only marketing system.
- CMS page payloads now provide route-level SEO, structured data, and optional rich HTML content.
- Typed frontend content modules still provide section props for the parts of marketing pages that remain code-composed.
- Blog posts and docs pages render primary content directly from CMS.

## Responsibility Boundaries

- Route files:
  - fetch CMS payloads
  - generate metadata
  - inject JSON-LD
  - compose page-level sections
- `features/marketing/sections/*`:
  - render reusable visual sections from typed props
- `components/cms/*`:
  - render CMS HTML and JSON-LD consistently
- `features/cms/*`:
  - render blog lists, docs sidebar, and docs TOC behaviors

## Server and Client Rules

- Marketing routes stay as Server Components by default.
- Use Client Components only for local interaction or browser observers.
- Keep CMS data fetching in the route or service layer, never in presentation leaves.
- Keep metadata and structured data at the route level.

## Docs and Blog Architecture

- Blog index is a server route that combines CMS page SEO with paginated CMS post data.
- Blog detail is a server route that renders CMS post content, image, author, and category information.
- Docs layout fetches recursive sidebar data server-side and passes it into a client sidebar renderer.
- Docs pages process CMS HTML headings server-side and hand the derived TOC to a client observer component.

## Reuse Rules

- Reuse existing sections and layouts before introducing new public page variants.
- Reuse `CmsContent` for CMS HTML rendering instead of route-specific wrappers.
- Reuse `JsonLd` for structured data instead of inline bespoke script generation when consuming CMS payloads.
- Keep hybrid marketing routes explicit rather than hiding CMS behavior inside generic sections.

