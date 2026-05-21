# Routing Architecture

This document defines the current filesystem routing architecture for the Next.js App Router frontend.

## Overview

- All user-facing routes are locale-first under `/{locale}`.
- Route identity is defined by the filesystem, not middleware headers.
- Public marketing, blog, and docs are part of the `(marketing)` route group.
- Protected dashboard routes stay tenant-scoped under `stores/[storeId]`.

## Route Ownership

### Public Marketing (`(marketing)`)
- Path: `/{locale}`
- Routes: `/`, `/features`, `/pricing`, `/enterprise`, `/blog`, `/blog/[slug]`, `/docs`, `/docs/[...slug]`, `/demo`, `/about`, `/contact`, `/templates`
- Behavior: always public and locale-aware.
- Rendering: server-first App Router pages with CMS-backed metadata; blog and docs content render from CMS APIs.

### Authentication (`(auth)`)
- Path: `/{locale}`
- Routes: `/login`, `/signup`, `/onboarding`, `/create-store`
- Behavior: unauthenticated entry points with redirects for active sessions.

### Protected Dashboard (`(dashboard)`)
- Path: `/{locale}/stores/{storeId}`
- Routes: `/dashboard`, `/products`, `/orders`, `/categories`, `/brands`, `/tags`, `/users`
- Behavior: requires an active session and permission-aware backend access.

### Storefront (`(storefront)`)
- Status: not an active public rendering surface in this frontend.
- Current behavior: middleware redirects storefront hostnames to the marketing base domain.

## CMS Route Map

- Marketing page payloads: `/api/v1/public/cms/pages/{slug}`
- Blog index: `/api/v1/public/cms/blog`
- Blog detail: `/api/v1/public/cms/blog/{slug}`
- Docs sidebar: `/api/v1/public/cms/docs/sidebar`
- Docs detail: `/api/v1/public/cms/docs/{slugPath}`
- Sitemap: `/api/v1/public/cms/seo/sitemap/{domain}`
- Robots source: `/api/v1/public/cms/seo/robots.txt`

## Middleware Responsibilities

`src/middleware.ts` is responsible for:

1. locale handling through `next-intl`
2. tenant resolution from hostname
3. session protection for dashboard routes
4. auth redirects for protected pages
5. storefront-to-marketing redirects for legacy storefront hostnames

Middleware does not decide page ownership for marketing, blog, docs, or dashboard routes. Filesystem routing remains canonical.

## Internationalization

- `src/i18n/routing.ts` defines supported locales.
- `src/app/[locale]/layout.tsx` exports `generateStaticParams()` for locales.
- Use locale-aware route construction and navigation helpers; do not hardcode mixed locale paths.
- CMS SEO alternates map directly into Next.js metadata alternates.

