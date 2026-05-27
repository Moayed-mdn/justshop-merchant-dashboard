# Store Switching

Store switching is a core capability of the Merchant Workspace, allowing merchants to change their active context without a full page reload.

## Lifecycle

1. **Selection**: User selects a store from the `WorkspaceStoreSwitcher`.
2. **Mutation**: The `useSwitchStore` hook triggers the `PATCH /api/v1/merchant/auth/active-store` API call.
3. **State Sync**: 
   - On success, the backend returns the updated `BootstrapData`.
   - The `bootstrapStore` is updated with the new data, including the new `activeStore`.
   - TanStack Query caches for store-specific data are invalidated (except for global `merchant.me` data).
4. **Broadcast**: A message is sent via `BroadcastChannel` to sync the active store across other open tabs.
5. **Navigation**: The router navigates the user to the appropriate landing page (usually `/merchant/dashboard`).

## Component: WorkspaceStoreSwitcher

- **Active Stores**: Selectable items that trigger the switch mutation.
- **Provisioning/Pending Stores**: Displayed as disabled items with a status badge.
- **Add Store**: A special item that navigates to the store creation flow.
- **Loading State**: The switcher is disabled while a switch is in progress or while any store is being provisioned.

## Technical Implementation

- **Hook**: `useSwitchStore` (wraps the mutation logic).
- **Store**: `bootstrapStore.switchStore` (handles the API call and state update).
- **Cache Invalidation**: Query keys prefixed with the previous store ID are invalidated to prevent data leakage.
