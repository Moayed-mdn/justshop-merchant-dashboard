# Merchant Workspace Architecture

The merchant workspace is a persistent application shell at `/merchant` designed to support multi-store management. It separates the initial onboarding experience (`/setup`) from the long-term operational experience of managing one or more stores.

## Key Concepts

- **Workspace Shell**: A shared layout group `(merchant)` that hosts the sidebar, topbar, and store switcher.
- **Context-Agnostic Layout**: Unlike the `/stores/[storeId]` routes, the workspace layout does not require a `storeId` in the URL. It derives the active store from the client-side `bootstrapStore`.
- **Slot Composition**: The `DashboardShell` has been updated to accept `nav` and `switcher` slots, allowing the workspace to inject its own navigation and switcher while reusing the base shell UI.

## Route Group Structure

- `src/app/[locale]/(merchant)/`: The route group folder.
  - `layout.tsx`: The workspace layout that wires the shell.
  - `merchant/page.tsx`: Redirects to `/merchant/dashboard`.
  - `merchant/dashboard/page.tsx`: The multi-store dashboard overview.
  - `merchant/stores/page.tsx`: The store management list.
  - `merchant/stores/create/page.tsx`: The additional store creation flow.
  - `merchant/stores/[store]/settings/page.tsx`: Store-specific settings.

## Guard Logic

Workspace routes are protected by both edge middleware and the `BootstrapProvider`.
- **Edge**: Redirects unauthenticated users to login.
- **Provider**: Ensures users have completed setup. If a user is in a `pending_verification`, `create_store`, or `provisioning` state for their first store, they are redirected back to `/setup`.

## Extensibility

The architecture is designed to be easily extended with new workspace-level features (e.g., billing, global settings) by adding new routes under the `(merchant)` group and updating the `WorkspaceSidebarNav` configuration.
