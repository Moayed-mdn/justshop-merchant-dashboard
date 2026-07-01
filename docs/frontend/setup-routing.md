# Setup Routing

## Canonical Route

```
/[locale]/setup
```

This is the single entry point for all merchant onboarding. All setup steps render inside this route — there are no sub-routes or redirects between steps.

---

## Legacy Compatibility

The following routes are preserved as permanent redirects:

| Route              | Redirects to       | Reason                          |
|--------------------|--------------------|---------------------------------|
| `/onboarding`      | `/setup`           | Legacy canonical onboarding URL |
| `/create-store`    | `/setup`           | Legacy store creation URL       |

These redirects are implemented as Next.js server-side redirects in their respective `page.tsx` files using `redirect()` from `next/navigation`.

---

## Route Guards

The `/setup` route has no middleware-level guard (the middleware only protects `/stores/*`). Access control is handled client-side:

1. `BootstrapProvider` fetches bootstrap on mount
2. `SetupOrchestrator` reads bootstrap state and renders the appropriate step
3. If bootstrap is not resolved, a loading/recovery screen is shown
4. If the merchant has a ready store, `ProvisioningStep` redirects to the dashboard automatically

This means unauthenticated users who land on `/setup` will see the loading screen briefly, then be redirected to login by the bootstrap 401 handler in `bootstrapStore.fetchBootstrap`.

---

## ROUTES Configuration

```ts
// Canonical
ROUTES.setup()           // '/setup'

// Legacy (redirect targets only — do not use for new navigation)
ROUTES.onboarding.home()       // '/onboarding'
ROUTES.onboarding.createStore() // '/create-store'
```

Always use `ROUTES.setup()` for any new navigation that points to the setup flow.

---

## API Route Organization

Store-related API routes are accessed via the `API_ROUTES.merchant.stores` namespace:

```ts
API_ROUTES.merchant.stores.create()                    // POST /api/v1/merchant/stores
API_ROUTES.merchant.stores.slugCheck(slug)             // GET  /api/v1/merchant/stores/slug-check?slug=
API_ROUTES.merchant.stores.provisioningStatus(store)   // GET  /api/v1/merchant/stores/{store}/provisioning-status
```

All legacy `admin` and `users` patterns have been removed. Use the context-aware `merchant` namespace exclusively for merchant operations.

For the planned slug migration, `provisioningStatus(store)` should treat `{store}` as the public store slug while internal provisioning state remains tied to the resolved `store_id`.
