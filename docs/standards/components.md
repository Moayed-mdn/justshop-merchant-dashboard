# Component Standards

## Core Boundaries

- Keep route pages and layouts thin; they orchestrate data, metadata, and high-level composition.
- Keep business and transport logic out of presentational components.
- Shared low-level UI belongs in `components/ui`.
- Shared CMS rendering primitives belong in `components/cms`.
- Domain-specific UI belongs in `features/*`.

## RSC Boundaries

- Server Components are the default for route files and non-interactive CMS rendering.
- Client Components are reserved for browser-only concerns such as effects, local state, event handlers, and scroll observation.
- Mark client boundaries explicitly with `'use client'`.
- Do not import client hooks or browser APIs into server-rendered CMS routes.

## CMS Component Rules

- Render CMS HTML through `CmsContent` to keep styling and HTML output consistent.
- Render CMS structured data through `JsonLd` at the route level.
- Keep docs sidebar and TOC interactions inside dedicated client components.
- Do not duplicate rich-text rendering wrappers across blog, docs, and marketing routes.

## Marketing Composition Rules

- Marketing sections remain prop-driven and composable.
- Route files may combine typed marketing sections with CMS page payloads when the current implementation is hybrid.
- Keep page-specific content resolution out of shared section components.
- Do not move CMS service calls into section leaves.

## Dynamic Route Rules

- Blog and docs route files own slug-specific orchestration only.
- Missing CMS content should resolve through route-level fallback or `notFound()` behavior, not component-level guessing.
- Keep recursive docs navigation data in CMS-driven feature components instead of hardcoded JSX trees.

