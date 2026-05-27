# Active Store Routing

Active Store Routing is the mechanism that allows the application to serve store-specific content without encoding the store identity in every operational URL.

## Technical Flow

1. **Bootstrap**: On application load, the `BootstrapProvider` fetches the user's profile, which includes the `active_store_id`.
2. **Context**: The `activeStore` is stored in the `bootstrapStore` (Zustand).
3. **Route Resolution**: Canonical workspace routes (`/merchant/*`) use the `activeStore.id` from the context to scope their API calls.
4. **Persistence**: When a user switches stores, the `PATCH /api/v1/merchant/auth/active-store` API call persists the new selection on the backend.

## State Safety

- **Cache Invalidation**: Switching stores triggers an invalidation of all store-scoped TanStack Query keys to prevent data leakage.
- **Race Conditions**: The `useSwitchStore` hook manages loading states and prevents navigation until the new context is fully hydrated.
- **Refresh Safety**: Since the active store is persisted on the backend, refreshing the page always restores the correct context.

## URL Structure Principles

- **Operational Routes**: `/merchant/products` (What I am doing).
- **Context Routes**: `/merchant/stores` (Which store am I doing it in).
- **Identity**: Resolved from session/context.
