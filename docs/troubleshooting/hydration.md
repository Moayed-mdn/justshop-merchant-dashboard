# Hydration Issues

## CMS Rendering Checks

- Keep server/client boundaries explicit and use `'use client'` only where browser behavior is required.
- Ensure CMS HTML transforms are deterministic between server render and client hydration.
- For docs pages, keep heading id generation inside `processContentHeadings()` on the server; do not regenerate ids differently in the client.
- Do not branch rendered CMS HTML on `window`, viewport size, random values, or current time.

## Date and Serialization Checks

- Treat CMS timestamps as ISO-8601 strings at the API boundary.
- Format dates only for display and do not mutate the original payload shape before hydration.
- If server and client render different date output, verify locale handling and timezone assumptions in the formatter rather than changing the CMS contract.

## Metadata and JSON-LD Checks

- Keep route metadata in `generateMetadata()` and route-level server files.
- Render JSON-LD with deterministic `JSON.stringify` output.
- Do not let client-only conditions add or remove structured data after hydration.

## General Checks

- Avoid nested document tags such as `html` or `body` inside route components.
- Isolate browser APIs to client components and effects.
- Keep request-host-derived metadata base resolution centralized in `src/app/[locale]/layout.tsx`.
- If hydration fails only on a custom local domain, verify `next.config.ts` development origin settings and active hostname resolution.

