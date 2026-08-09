# Workspace Routing Architecture

The Merchant Workspace has a workspace-centric architecture where merchants operate within a unified workspace (`/merchant/*`), and the "Active Store" is managed as internal application context rather than being part of the URL.

## Core Principle

The merchant operates within **one** workspace (`/merchant/*`), while the "Active Store" is resolved from state/session.

- **Current Model**: `/merchant/products` (Active store is resolved from state/session)

## Benefits

- **Consistency**: Unified sidebar and topbar across all operational tasks
- **Context Preservation**: Switching stores doesn't break the application shell or navigation state
- **Deep Linking**: Operational URLs are stable and represent capabilities rather than specific instances

## Route Categories

1. **Workspace Routes (`/merchant/*`)**: Routes for merchant operations (Dashboard, Orders, Products, etc.) that react to the `activeStore` context
2. **Management Routes (`/merchant/stores/:id/settings`)**: Routes for managing specific store metadata or configuration

## Navigation Flow

1. User visits `/merchant/dashboard`.
2. The `BootstrapProvider` ensures an `activeStore` is set.
3. Components fetch data scoped to `activeStore.id`.
4. User switches stores via the `WorkspaceStoreSwitcher`.
5. The workspace updates its context and refreshes data without changing the base URL.
