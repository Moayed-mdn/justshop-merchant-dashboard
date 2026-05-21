# Build Errors

## App Router Metadata Pitfalls

- `generateMetadata()` must stay server-safe and must not import client hooks or browser-only modules.
- Return `Metadata` objects through canonical helpers such as `buildMetadataFromSeo()` when using CMS SEO payloads.
- If metadata types fail, verify the CMS contract in `src/types/cms.ts` before adding route-local casts.
- Keep `metadataBase` host resolution centralized instead of rebuilding URL logic in multiple files.

## CMS and Rendering Pitfalls

- Verify imports from `src/services/cms/cms.service.ts`, `src/lib/seo/cms-seo.ts`, and `src/components/cms/*` before assuming framework issues.
- If a docs or blog route fails to build, confirm the dynamic segment file and param typing match the actual App Router route shape.
- If TOC or sidebar code breaks the build, confirm browser-only logic stays inside client components.
- If CMS HTML rendering causes failures, verify the shared renderer and helpers rather than creating route-specific workarounds.

## General Checks

- Validate import paths and alias usage first.
- Check named versus default export mismatches.
- Ensure client hooks are not imported into server-only modules.
- Verify package APIs such as `nuqs` and `next-intl` against the installed version.

