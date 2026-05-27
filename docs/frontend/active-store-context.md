# Active Store Context

The concept of an "Active Store" is the primary context for the Merchant Workspace.

## Source of Truth

The `bootstrapStore` (Zustand) is the single source of truth for the active store context on the client.
- **`activeStore`**: The `Store` object representing the currently selected business.
- **`stores`**: The full list of stores the merchant has access to.

## Resolution Pattern

1. **Initial Load**: The `BootstrapProvider` fetches `GET /api/v1/merchant/me`. The response includes the `active_store_id` (persisted on the backend).
2. **Reactivity**: Components use the `useBootstrapStore(selectActiveStore)` selector to reactively update when the store changes.
3. **API Scoping**: All store-specific API calls are scoped using the ID from the active store context (e.g., `API_ROUTES.store(activeStore.id).products()`).

## No Client-Side Persistence

The active store is **not** stored in `localStorage` or cookies on the client. It is persisted on the backend in the user's session/profile. This ensures that:
- The context is consistent across devices.
- Refreshes always restore the last selected store from the server.
- Security and permissions are always validated by the backend during the bootstrap process.

## Handling "No Active Store"

If a merchant has stores but none are "active" (e.g., all are disabled or pending), the workspace renders a `WorkspaceEmptyState` prompting the user to resolve the status or select another store.
