# Marketing Content Strategy

## Current Source Model

- Public marketing content is hybrid.
- Laravel CMS is the source of truth for route-level SEO, structured data, and CMS-authored rich content.
- Typed frontend content modules still provide section copy for code-composed marketing sections that have not moved into CMS.
- Blog and docs content are CMS-authored, not static frontend content arrays.

## Messaging Rules

- Keep public messaging credible, operational, and product-specific.
- Emphasize multi-tenant commerce, localization, merchant workflows, and platform reliability.
- Avoid hype-heavy claims, fake metrics, or implementation promises not present in the product.
- Keep terminology consistent across CMS content and typed frontend marketing content.

## CMS Content Rules

- CMS SEO fields must align with the visible route content.
- CMS structured data must describe the actual rendered entity and page purpose.
- CMS timestamps and ordering should be treated as backend-owned contract data.
- Do not recreate blog or docs navigation structure in frontend content files.

## Hybrid Marketing Rules

- Do not describe marketing as a static content system.
- Do not assume every marketing section comes from CMS blocks; the current implementation is route-level CMS plus typed section composition.
- Keep frontend content modules small, typed, and section-oriented until a route actually moves more content into CMS.
- Prefer CMS page payloads for route-level concerns and canonical page body content.

## Localization Rules

- Public routes stay locale-first.
- Preserve semantic equivalence across locales instead of literal translation.
- CMS SEO alternates and locale-aware route metadata must stay aligned.
- Keep RTL-safe rendering in mind for both CMS HTML output and typed section content.

## Blog and Docs Rules

- Blog posts are authored in CMS and rendered through the CMS service layer.
- Documentation hierarchy, slug paths, and ordering come from CMS sidebar data.
- TOC structure is derived from CMS HTML headings at render time.
- Avoid duplicating editorial hierarchy in hardcoded frontend constants.

