# AI Agent Operating Rules

## Mandatory Reading

1. docs/README.md

Read all additional relevant documentation before making changes.

---

# Core Principles

- Preserve existing architecture and conventions.
- The codebase is the source of truth.
- Reuse existing patterns before creating new ones.
- Prefer consistency over introducing new abstractions.
- Keep changes minimal, focused, and predictable.
- Never perform unrelated refactors.
- Never introduce architectural drift.
- Follow existing folder and naming conventions.
- Keep shared standards centralized.

When documentation conflicts with implementation:
- trust the implementation first,
- then determine whether documentation must be updated,
- never silently change architectural assumptions.

---

# Architecture Rules

- Never bypass the shared API layer.
- Never hardcode routes.
- Never duplicate business logic.
- Never duplicate types already defined elsewhere.
- Never introduce parallel implementations.
- Never move business logic into UI components.
- Preserve server/client component boundaries.
- Preserve multi-tenant routing architecture.
- Preserve locale-first routing architecture.
- Respect permission and auth boundaries at all times.

---

# TypeScript Rules

- Never use `any`.
- Prefer explicit types when inference is unclear.
- Reuse existing shared types before creating new ones.
- Keep types centralized and consistent.
- Preserve strict typing guarantees.

---

# Component Rules

- Reuse existing UI patterns before creating new components.
- Keep components focused and composable.
- Avoid deeply nested conditional rendering.
- Avoid large monolithic components.
- Preserve existing design system patterns.
- Do not introduce inconsistent styling approaches.

---

# Forms & State Rules

- Follow existing form standards and validation patterns.
- Reuse existing form utilities and schemas.
- Avoid duplicating form state logic.
- Keep state localized unless already shared by architecture.

---

# Fetching & Data Rules

- Follow established fetching patterns.
- Do not introduce inconsistent data-fetching strategies.
- Preserve server-first data loading architecture.
- Client fetching should only be used for interactive updates where already appropriate.

---

# Security Rules

- Never bypass auth or permission checks.
- Never expose sensitive tokens or credentials.
- Preserve session/cookie authentication architecture.
- Respect Sanctum and middleware boundaries.
- Never store auth tokens in localStorage unless explicitly required by architecture docs.

---

# Documentation Synchronization Rules

When implementation changes affect:
- architecture,
- standards,
- routing,
- auth,
- permissions,
- API contracts,
- shared patterns,
- rendering strategy,
- data flow,
- or developer workflows,

the agent MUST:

1. Identify affected documentation.
2. Update canonical docs in `docs/*`.
3. Avoid leaving stale documentation.
4. Prefer updating existing docs over creating new files.
5. Keep documentation aligned with actual implementation.

Documentation updates are required for architectural and behavioral changes, not only code changes.

Never create duplicate documentation for topics already covered by canonical docs.

---

# Editing Workflow

Before making changes:

1. Inspect the existing implementation.
2. Identify existing patterns nearby.
3. Read all relevant documentation for the task.
4. Reuse existing utilities, helpers, routes, and types.
5. Understand the current architecture before modifying it.

During edits:

- Make the smallest reasonable change.
- Preserve runtime behavior unless the task explicitly requires changing it.
- Avoid placeholder implementations.
- Avoid partial migrations unless requested.
- Avoid speculative refactors.

---

# Completion Requirements

Before finishing:

- Ensure architecture consistency.
- Ensure no duplicated logic or types were introduced.
- Ensure imports remain clean and organized.
- Ensure no dead code was added.
- Ensure no debug code or console logs remain.
- Ensure relevant documentation is updated if behavior or architecture changed.
- Ensure TypeScript passes.
- Ensure lint rules pass.

Run validation when available:
