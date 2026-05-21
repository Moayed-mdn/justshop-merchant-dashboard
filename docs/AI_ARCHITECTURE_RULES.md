# AI Architecture Rules: LaraTenant Commerce

These rules are MANDATORY for all code modifications and additions. They ensure architectural consistency and prevent technical drift.

## Backend Rules (STRICT)

### 1. DTOs are Mandatory
- Every data transfer between layers (Action to Repository, Service to Action) MUST use a DTO.
- Never pass raw Request objects into Actions or Repositories.

### 2. Thin Controllers
- Controllers should ONLY handle request validation (via FormRequests), calling an Action, and returning a Resource.
- Zero business logic in Controllers.

### 3. Action Pattern
- Every business operation MUST be an isolated Action class.
- Actions should do ONE thing (e.g., `CreateProductAction`, `UpdateOrderStatusAction`).

### 4. Multitenancy
- All commerce entities MUST be scoped to a `store_id`.
- Tenant resolution happens at the middleware/resolver layer.

### 5. Localization
- All user-facing strings MUST be localized.
- Database content for commerce entities (names, descriptions) uses the translation table pattern.

---

## Frontend Rules (STRICT)

### 1. Next.js App Router Conventions
- Use Server Components by default.
- Convert to Client Components ONLY when interactivity (hooks, event listeners) is required.
- Keep Client Components at the leaves of the tree.

### 2. Data Fetching
- **Public CMS**: Fetch ONLY in Server Components using `serverFetch`.
- **Dashboard**: Use React Query for client-side mutations and list filtering.
- **Deduplication**: Never fetch the same data twice in one render pass.

### 3. SEO & Metadata
- Never use manual `<head>` tags.
- Use `generateMetadata()` in `page.tsx`.
- Use the `buildMetadataFromSeo` adapter for all CMS pages.
- Inject structured data via the `JsonLd` component.

### 4. CMS Rendering
- Use the `CmsContent` component for HTML rendering.
- Content must be hydration-safe; no unstable IDs or browser-only APIs.
- Automatic TOC extraction must happen on the server.

### 5. TypeScript & Safety
- **NO `any`**: Use `unknown` or specific interfaces.
- **Contract Drift**: Frontend types MUST mirror backend DTOs/Resources exactly.
- **Null Safety**: Handle all optional/nullable fields from the API.

### 6. UI & Styling
- Use `shadcn/ui` primitives.
- Match existing Tailwind patterns.
- Ensure RTL compatibility for all new components using `rtl:` prefix or logical properties.

---

## Forbidden Patterns (Anti-Patterns)

- **Parallel API Clients**: Do not create new fetchers. Use `serverFetch` or `clientFetch`.
- **Logic in Pages**: Do not put business logic or complex state in `page.tsx`. Use Features or Hooks.
- **MDX in CMS**: The CMS delivers HTML. Do not introduce MDX for CMS content.
- **Direct LocalStorage**: Do not use `localStorage` for sensitive auth state; use the centralized `AuthContext` and cookies.
- **Speculative Refactors**: Do not refactor stable systems unless explicitly requested.
