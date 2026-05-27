# Workspace Routing Architecture

The Merchant Workspace has transitioned from a store-centric routing model to a workspace-centric architecture. This ensures a coherent, single-application experience for merchants managing multiple stores.

## Core Principle

The merchant operates within **one** workspace (`/merchant/*`), while the "Active Store" is treated as internal application context.

- **Old Model**: `/stores/{storeId}/products` (Store identity is in the URL).
- **New Model**: `/merchant/products` (Active store is resolved from state/session).

## Benefits

- **Consistency**: Unified sidebar and topbar across all operational tasks.
- **Context Preservation**: Switching stores doesn't break the application shell or navigation state.
- **Deep Linking**: Operational URLs are stable and represent capabilities rather than specific instances.

## Route Categories

1. **Workspace Routes (`/merchant/*`)**: Canonical routes for merchant operations (Dashboard, Orders, Products, etc.). These react to the `activeStore` context.
2. **Management Routes (`/merchant/stores/:id/settings`)**: Routes for managing specific store metadata or configuration.
3. **Legacy Routes (`/stores/:id/*`)**: Kept for backward compatibility, these routes now serve as redirect adapters that hydrate the workspace context.

## Navigation Flow

1. User visits `/merchant/dashboard`.
2. The `BootstrapProvider` ensures an `activeStore` is set.
3. Components fetch data scoped to `activeStore.id`.
4. User switches stores via the `WorkspaceStoreSwitcher`.
5. The workspace updates its context and refreshes data without changing the base URL.
