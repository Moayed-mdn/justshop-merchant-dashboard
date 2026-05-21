# Session Authentication

- middleware checks for known session cookie names before protected access.
- protected paths redirect to locale-aware login with `redirect` query param.
- client fetch keeps `credentials: include` for cookie continuity.
- in development, `/api/proxy` normalizes upstream auth cookies for local domains so `laratenant.local` and `*.laratenant.local` can persist Laravel session cookies over HTTP.
- local HTTP development cookies must not remain `SameSite=None; Secure`; the proxy downgrades them for browser acceptance in dev only.
- avoid exposing auth credentials to JavaScript-accessible storage.
