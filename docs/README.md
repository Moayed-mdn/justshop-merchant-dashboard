# Documentation System

This directory is the canonical documentation for the Next.js + Laravel multi-tenant commerce platform.
The codebase is the source of truth. These docs describe what exists today.

## How To Use This

- Start with `architecture/` for system-level behavior and boundaries.
- Use `standards/` for implementation rules used in day-to-day work.
- Use `marketing/` for public-site architecture, SEO, and content rules.
- Use `security/` for session auth, Sanctum, and permission boundaries.
- Use `decisions/` for ADRs that explain why key patterns exist.
- Use `troubleshooting/` for recurring operational/debug issues.
- Use `migrations/` for historical changes that still matter.

## Structure

```text
docs/
├── README.md
├── architecture/
├── standards/
├── features/
├── marketing/
├── security/
├── decisions/
├── troubleshooting/
├── migrations/
└── archive/
```

## Architectural Philosophy

- Locale-first App Router under `src/app/[locale]`.
- Server-first architecture with Server Components for initial reads and route metadata.
- Laravel remains the API and CMS source of truth.
- Public marketing, blog, docs, sitemap, and robots consume the platform CMS through `src/services/cms/cms.service.ts`.
- Public CMS SEO maps into Next.js Metadata via `src/lib/seo/cms-seo.ts` and JSON-LD via `src/components/cms/JsonLd.tsx`.
- Public CMS reads use cache tags and App Router caching; interactive browser requests still use `/api/proxy`.

## Canonical Starting Points

- `architecture/frontend.md`: App Router, route groups, provider graph, and frontend boundaries.
- `architecture/cms.md`: CMS route map, service layer, docs/blog rendering flow, TOC/sidebar, and cache strategy.
- `architecture/rendering-strategy.md`: server-first rendering, hybrid SSR/ISR behavior, and RSC boundaries.
- `architecture/backend-integration.md`: Laravel integration model, public CMS boundaries, and proxy responsibilities.
- `marketing/seo.md`: CMS SEO contract, Metadata API usage, JSON-LD, sitemap, and robots.

## Contributor Rules

- Update canonical docs when architecture or standards change.
- Keep one source of truth per topic and cross-link instead of duplicating.
- Remove obsolete active guidance when implementation changes; keep historical notes in `archive/` or `migrations/` only.
- Do not describe planned architecture as implemented.
- Keep docs concise, architectural, and aligned with the current code.

