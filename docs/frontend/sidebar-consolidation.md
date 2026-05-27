# Sidebar Consolidation

The application now uses a single, canonical sidebar system representing merchant capabilities.

## Structure

The `WorkspaceSidebarNav` consolidates all current capabilities into a consistent hierarchy:

- **Dashboard**: Global overview of the active store.
- **Orders**: Management of sales and transactions.
- **Products**: Catalog management (Products, Categories, Brands, Tags).
- **Customers**: User and customer management.
- **Stores**: List and management of all merchant stores.
- **Settings**: Configuration for the active store and workspace.

## Visibility & Permissions

While the sidebar system is consistent, individual items are filtered based on the merchant's permissions and the status of the active store.

## Implementation

The sidebar is implemented as a dedicated component (`WorkspaceSidebarNav`) passed to the `DashboardShell`. It uses the `ROUTES.merchant` configuration to ensure all links point to the canonical workspace routes.
