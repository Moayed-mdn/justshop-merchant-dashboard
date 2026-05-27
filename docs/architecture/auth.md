# Authentication Architecture

## Current Model

- Session/cookie authentication with Laravel Sanctum-style flow.
- middleware (`src/middleware.ts`) is the primary route protection boundary.
- client auth, onboarding, permissions, and active store state are restored from the canonical bootstrap payload at `GET /api/v1/merchant/me`.
- `src/components/providers/BootstrapProvider.tsx` is the client-side bootstrap gate for session restoration and route recovery.
- `src/stores/bootstrapStore.ts` is the single client snapshot for bootstrap-derived dashboard state.

## Request Flow

1. Login, register, logout, and active-store mutations request a CSRF cookie first.
2. Auth mutations post to the Laravel API through the shared browser API layer.
3. Session cookies are set by backend and reused on later requests.
4. Client bootstrap fetches `GET /api/v1/merchant/me` and hydrates the dashboard shell, onboarding state, permissions, and active store context from that payload.
5. Middleware still guards protected pages server-side before client hydration.

## Client State

- `BootstrapProvider` is the client-side source of truth for bootstrap resolution and auth recovery.
- `useBootstrapStore()` holds the synchronized bootstrap snapshot and derived selectors (`user`, `stores`, `activeStore`, `permissions`, `onboarding`, `session`).
- TanStack Query owns the canonical bootstrap query key `['merchant', 'me']`.
- Unauthorized client responses dispatch `auth:unauthorized` event from `clientFetch`.
- `BootstrapProvider` handles unauthorized recovery centrally:
  - clears the bootstrap store on `401`
  - routes protected and onboarding pages back to locale-aware login
  - re-routes authenticated users into onboarding, provisioning, blocked-store, or ready dashboard states from bootstrap
- `useLogout()` handles the full logout flow centrally:
  - calls the shared logout action
  - clears local bootstrap state
  - clears TanStack Query cache
  - broadcasts logout to other tabs
  - redirects to locale-aware login in the UI layer

## Runtime Boundaries for 401 Handling

### clientFetch (Browser Runtime Detector)
- detects 401 status codes
- emits `auth:unauthorized` event via `window.dispatchEvent`
- does NOT redirect, mutate state, or clear cookies directly

### BootstrapProvider (Centralized Handler)
- listens for `auth:unauthorized` events
- clears bootstrap state when the session expires
- redirects protected dashboard routes to `/${locale}/login?redirect=...`
- keeps guest pages and bootstrap retry UI under client control

### Server Layouts (SSR Protection)
- middleware and server routing still stop protected route rendering when cookies are missing
- client bootstrap recovery handles expired sessions and interrupted onboarding after the app hydrates

## Rules

- no bearer token persistence in localStorage/sessionStorage.
- no auth header assembly in browser components.
- protected route checks must remain locale-aware.
- logout logic stays centralized in the auth/logout flow, not scattered across feature components.
- dashboard route decisions must derive from bootstrap, not from duplicated local auth state.
- permissions must derive from bootstrap `permissions`, not client role assumptions.
- HttpOnly cookies are cleared ONLY by server response Set-Cookie headers.
