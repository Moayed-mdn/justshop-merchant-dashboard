# Active Store Routing

Active Store Routing is the mechanism that allows the application to serve store-specific content without encoding the store identity in every operational URL.

## Technical Flow

1. **Bootstrap**: On application load, the `BootstrapProvider` fetches the user's profile, which includes the `active_store_id`.
2. **Context**: The `activeStore` is stored in the `bootstrapStore` (Zustand).
3. **Route Resolution**: Canonical workspace routes (`/merchant/*`) use the active store from context to scope their API calls.
4. **Persistence**: When a user switches stores, the `PATCH /api/v1/merchant/auth/active-store` API call persists the new selection on the backend.

## State Safety

- **Cache Invalidation**: Switching stores triggers an invalidation of all store-scoped TanStack Query keys to prevent data leakage.
- **Race Conditions**: The `useSwitchStore` hook manages loading states and prevents navigation until the new context is fully hydrated.
- **Refresh Safety**: Since the active store is persisted on the backend, refreshing the page always restores the correct context.

## URL Structure Principles

- **Operational Routes**: `/merchant/products` (What I am doing).
- **Context Routes**: `/merchant/stores` (Which store am I doing it in).
- **Identity**: Resolved from session/context.

## Slug Migration Inventory

The merchant workspace keeps clean frontend page routes like `/merchant/products`, but the API layer still mostly builds store-scoped URLs with `activeStore.id`.

Target direction:

- frontend page routes remain `/merchant/*`
- merchant API routes move from `stores/{storeId}` to `stores/{storeSlug}`
- bootstrap/session persistence remains ID-based internally

### Dashboard API Helpers That Should Switch To Slug

The following helper groups currently interpolate the active store identifier into `/api/v1/merchant/stores/{store}/...` and should use `activeStore.slug` after the slug migration lands:

| Helper Group | Current Pattern |
| :--- | :--- |
| `API_ROUTES.merchant.stores.detail/update` | `/api/v1/merchant/stores/{store}` |
| `API_ROUTES.merchant.stores.provisioningStatus` | `/api/v1/merchant/stores/{store}/provisioning-status` |
| `API_ROUTES.store(...).dashboard()` | `/api/v1/merchant/stores/{store}/dashboard/*` |
| `API_ROUTES.store(...).products()` | `/api/v1/merchant/stores/{store}/products/*` |
| `API_ROUTES.store(...).orders()` | `/api/v1/merchant/stores/{store}/orders/*` |
| `API_ROUTES.store(...).categories()` | `/api/v1/merchant/stores/{store}/categories/*` |
| `API_ROUTES.store(...).brands()` | `/api/v1/merchant/stores/{store}/brands/*` |
| `API_ROUTES.store(...).tags()` | `/api/v1/merchant/stores/{store}/tags/*` |
| `API_ROUTES.store(...).users()` | `/api/v1/merchant/stores/{store}/users/*` |
| `API_ROUTES.store(...).navigation()` | `/api/v1/merchant/stores/{store}/navigation/*` |
| `API_ROUTES.store(...).assets()` | `/api/v1/merchant/stores/{store}/assets/*` |
| `API_ROUTES.store(...).themes()` | `/api/v1/merchant/stores/{store}/themes/*` |
| `API_ROUTES.store(...).templates()` | `/api/v1/merchant/stores/{store}/templates/*` |
| `API_ROUTES.store(...).cmsPages()` | `/api/v1/merchant/stores/{store}/cms/pages/*` |
| `API_ROUTES.store(...).sectionTypes/sectionSchemas` | `/api/v1/merchant/stores/{store}/cms/section-types` and `/section-schemas` |
| `API_ROUTES.store(...).shipping()` | `/api/v1/merchant/stores/{store}/shipping/*` |

### Frontend URLs That Should Prefer Slug

The dashboard also has a store-specific settings page that already supports a slug-looking identifier and should standardize on slug:

| Frontend Route | Target |
| :--- | :--- |
| `/[locale]/merchant/stores/{store}/settings` | Use store slug as the canonical `{store}` value |

### Contracts That Must Stay ID-Based

These contracts should not be converted to slug because they represent internal selection state, not public route identity:

- `active_store_id` in bootstrap payloads
- `last_active_store_id` on the backend user record
- `PATCH /api/v1/merchant/auth/active-store` request payload with `store_id`
- repository, DTO, and policy scoping that uses resolved `store_id`
