# TypeScript Standards

## Core Rules

- Strict typing is required for feature and shared modules.
- Avoid `any`; use explicit interfaces, unions, and typed helpers.
- Reuse canonical shared types before creating new ones.
- Keep API contract types separate from presentation-only props where shaping is required.

## CMS Typing Strategy

- Public CMS payloads are typed in `src/types/cms.ts`.
- `SeoPayload` is the canonical public SEO contract.
- `MarketingPage`, `BlogPost`, `DocumentationPage`, `DocumentationSidebar`, and `SitemapEntry` define the current frontend CMS boundary.
- Route files and components should consume these shared types through `cmsService`, not via locally duplicated interfaces.

## Metadata and Structured Data Typing

- Use Next.js `Metadata` for route metadata return values.
- Treat CMS `structured_data` as `Record<string, unknown>` until a narrower shared contract is introduced centrally.
- Do not cast CMS payloads to loose custom shapes in each route.
- Keep JSON-LD helpers generic and route-level.

## Date and Serialization Rules

- CMS timestamps remain strings at the API boundary.
- Assume ISO-8601 serialization from the backend and format only when rendering.
- Do not eagerly convert CMS date fields into `Date` objects in shared types.
- Deterministic string contracts reduce hydration drift across server and client.

## Route and Config Typing

- Keep route/query/config constants strongly typed with `as const` where useful.
- Type App Router params explicitly in server route files.
- Prefer typed service return values over inferred `unknown` response handling in pages and components.

