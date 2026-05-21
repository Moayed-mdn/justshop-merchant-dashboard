# Fetching Standards

## Core Rules

- Use Server Components plus `serverFetch` for initial reads, detail reads, and route metadata.
- Use `clientFetch` and feature hooks for interactive browser-side lists, filters, and mutations.
- Keep public CMS reads in `src/services/cms/cms.service.ts`.
- Parse URL query state with schemas where that pattern already exists and keep the URL as source of truth.
- Keep query keys and cache tags stable and centralized.

## Server Fetch Usage

- `serverFetch` is the canonical server transport.
- It forwards cookies from `next/headers`.
- It resolves locale from cookies and sends it upstream in `Accept-Language`.
- It throws normalized `ApiError` on non-2xx responses.
- Default cache mode is `no-store`; callers must opt into cache behavior explicitly.

## CMS Fetching Rules

- CMS routes must not call `fetch` directly from page files.
- Use `cmsService` methods such as `getPage()`, `getBlogPosts()`, `getBlogPost()`, `getDocsSidebar()`, and `getDocsPage()`.
- Public CMS reads should use `force-cache` plus stable tags in the service layer.
- Keep cache tags in the service layer, not duplicated in route components.
- Use `no-store` only when freshness requirements differ, such as sitemap retrieval.

## SSR and App Router Flow

- `generateMetadata()` is a server read and follows the same canonical fetch boundaries.
- Do not fetch public CMS metadata client-side.
- Do not move public content reads into effects to simulate SSR.
- Keep route pages as server orchestrators and pass data into client leaves only when interactivity is required.

## Proxy Responsibility Rules

- `/api/proxy` is for browser-originated requests only.
- Do not route server CMS reads through `/api/proxy`.
- Do not duplicate cookie, XSRF, or locale forwarding outside canonical fetch utilities.
- Avoid introducing runtime-ambiguous helpers that may run on either server or client without clear boundaries.

