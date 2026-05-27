# Requirements Document

## Introduction

The merchant workspace is the authenticated SaaS application shell that a merchant lives in after completing the first-store setup flow. It replaces the current pattern — where merchants land directly in a store-scoped route (`/stores/{storeId}/dashboard`) — with a persistent workspace layer at `/merchant` that owns the application chrome (sidebar, top navigation, store switcher, user menu) and hosts all post-onboarding merchant activity.

The workspace must coexist with the existing `/setup` flow and the existing `/stores/{storeId}/*` dashboard routes without breaking either. It introduces a new route group `(merchant)` alongside the existing `(dashboard)` group. The existing `bootstrapStore` Zustand store and `BootstrapProvider` remain the single source of truth for session, active store, and provisioning state.

---

## Glossary

- **Workspace**: The authenticated application shell at `/merchant` that a merchant uses after completing setup.
- **Workspace_Shell**: The layout component that renders the sidebar, top navigation, store switcher, and user menu for all `/merchant/*` routes.
- **Store_Switcher**: The UI control that lists all of the merchant's stores, highlights the active store, and allows switching or creating a new store.
- **Active_Store**: The store currently selected by the merchant, as tracked by `bootstrapStore.activeStore` and confirmed by the backend via `PATCH /api/v1/users/auth/active-store`.
- **Bootstrap**: The `GET /api/v1/me` response, managed by `bootstrapStore`, that is the single source of truth for session state, store list, active store, and onboarding step.
- **BootstrapProvider**: The existing client provider that resolves bootstrap state and enforces routing guards across the application.
- **bootstrapStore**: The existing Zustand store (`src/stores/bootstrapStore.ts`) that holds bootstrap data, active store, stores list, provisioning state, and auth actions.
- **Setup_Flow**: The existing `/setup` route and its state machine (`SetupOrchestrator`) that handles first-store creation and provisioning.
- **CreateStoreStep**: The existing component at `src/features/setup/components/CreateStoreStep.tsx` used for store creation form and submission.
- **ProvisioningStep**: The existing component at `src/features/setup/components/ProvisioningStep.tsx` used for provisioning polling and lifecycle UI.
- **Workspace_Provisioning_View**: A provisioning UI rendered inside the workspace (not at `/setup`) when an additional store is being provisioned.
- **Store_Settings**: The page at `/merchant/stores/{store}/settings` where a merchant can edit a store's name and basic metadata.
- **ROUTES**: The centralized route configuration at `src/config/routes.ts`.
- **API_ROUTES**: The centralized API route configuration at `src/config/routes.ts`.

---

## Requirements

### Requirement 1: Workspace Route Group and Shell Layout

**User Story:** As a merchant, I want a persistent application shell at `/merchant` so that I have a consistent navigation experience across all workspace pages.

#### Acceptance Criteria

1. THE Workspace_Shell SHALL render a sidebar, top navigation bar, store switcher, and user menu for all routes under `/merchant/*`.
2. WHEN a merchant navigates to any `/merchant/*` route, THE Workspace_Shell SHALL remain mounted without full-page reloads between workspace pages.
3. THE Workspace_Shell SHALL reuse the existing `DashboardShell`, `Sidebar`, `Topbar`, `SidebarNav`, `UserMenu`, `ThemeToggle`, and `LocaleToggle` components from `src/features/dashboard/shell/` without duplicating them.
4. THE Workspace_Shell SHALL read active store, user, and stores list exclusively from `bootstrapStore` selectors (`selectActiveStore`, `selectUser`, `selectStores`).
5. WHEN `bootstrapStore.isBootstrapping` is `true`, THE Workspace_Shell SHALL render a loading state and defer rendering workspace content.
6. WHEN `bootstrapStore.bootstrapError` is non-null on a protected workspace route, THE Workspace_Shell SHALL render an error recovery UI consistent with the existing `BootstrapProvider` error pattern.
7. THE Workspace_Shell SHALL support RTL layout by reading direction state from `uiStore` using the existing `selectIsRTL` selector.
8. THE Workspace_Shell SHALL be implemented as a new `(merchant)` route group at `src/app/[locale]/(merchant)/` without modifying the existing `(dashboard)` route group.

---

### Requirement 2: Workspace Routing Guard

**User Story:** As a merchant, I want workspace routes to be protected so that unauthenticated users are redirected to login and users who have not completed setup are redirected to `/setup`.

#### Acceptance Criteria

1. WHEN an unauthenticated user accesses any `/merchant/*` route, THE BootstrapProvider SHALL redirect the user to `/login`.
2. WHEN an authenticated user whose `bootstrapStore.onboarding.step` is `create_store` or `pending_verification` accesses any `/merchant/*` route, THE BootstrapProvider SHALL redirect the user to `/setup`.
3. WHEN an authenticated user whose `needsProvisioningFlow(bootstrap, provisioning)` returns `true` accesses any `/merchant/*` route and the user has no active ready store, THE BootstrapProvider SHALL redirect the user to `/setup`.
4. WHEN an authenticated user with a ready active store accesses `/merchant`, THE Workspace_Shell SHALL redirect the user to `/merchant/dashboard`.
5. THE BootstrapProvider SHALL classify all `/merchant/*` paths as protected routes, applying the same guard logic it currently applies to `/stores/*` paths.
6. IF `bootstrapStore.bootstrapResolved` is `false`, THEN THE BootstrapProvider SHALL render the existing loading screen and SHALL NOT redirect until bootstrap is resolved.

---

### Requirement 3: Store Switcher

**User Story:** As a merchant with multiple stores, I want a store switcher in the workspace navigation so that I can change my active store without leaving the workspace.

#### Acceptance Criteria

1. THE Store_Switcher SHALL display all stores from `bootstrapStore.stores` in a dropdown, with the current `bootstrapStore.activeStore` highlighted as the selected value.
2. WHEN a merchant selects a different store in the Store_Switcher, THE Store_Switcher SHALL call `bootstrapStore.switchStore(storeId)`, which calls `PATCH /api/v1/users/auth/active-store`.
3. WHILE `bootstrapStore.switchStore` is pending, THE Store_Switcher SHALL render a loading indicator and disable further store selection.
4. WHEN `bootstrapStore.switchStore` completes successfully, THE Store_Switcher SHALL reflect the new active store without a full page reload.
5. THE Store_Switcher SHALL include an option labeled "Add store" that navigates to `/merchant/stores/create`.
6. WHEN `bootstrapStore.stores` contains only stores with `status !== 'active'` or `is_active === false`, THE Store_Switcher SHALL render those stores as non-selectable items with a visual disabled state.
7. THE Store_Switcher SHALL reuse the existing `useSwitchStore` hook from `src/hooks/auth/useSwitchStore.ts` for the switch mutation.
8. THE Store_Switcher SHALL be placed in the workspace top navigation bar, consistent with its current position in the existing `Topbar` component.

---

### Requirement 4: Workspace Navigation Routes

**User Story:** As a merchant, I want workspace navigation links so that I can move between dashboard, stores, orders, and products sections.

#### Acceptance Criteria

1. THE Workspace_Shell SHALL provide navigation to the following routes: `/merchant/dashboard`, `/merchant/stores`, `/merchant/orders`, `/merchant/products`.
2. WHEN a merchant navigates to `/merchant/dashboard`, THE Workspace_Shell SHALL render the active store's dashboard overview content.
3. WHEN a merchant navigates to `/merchant/orders`, THE Workspace_Shell SHALL render the active store's orders list.
4. WHEN a merchant navigates to `/merchant/products`, THE Workspace_Shell SHALL render the active store's products list.
5. THE Workspace_Shell SHALL highlight the navigation item corresponding to the current route using the active path.
6. WHEN `bootstrapStore.activeStore` is `null` on a content route (`/merchant/dashboard`, `/merchant/orders`, `/merchant/products`), THE Workspace_Shell SHALL render an empty state prompting the merchant to select or create a store.
7. THE ROUTES configuration in `src/config/routes.ts` SHALL be extended with a `merchant` key containing typed route helpers for all `/merchant/*` paths.

---

### Requirement 5: Store List Page

**User Story:** As a merchant, I want a store management page so that I can see all my stores and their statuses in one place.

#### Acceptance Criteria

1. WHEN a merchant navigates to `/merchant/stores`, THE Workspace_Shell SHALL render a list of all stores from `bootstrapStore.stores`.
2. THE store list SHALL display each store's name, slug, and status badge.
3. THE store list SHALL visually distinguish stores by status: `active`, `provisioning`, `pending_setup`, `disabled`, `suspended`, `archived`.
4. WHEN a store has `status === 'active'` and `is_active === true`, THE store list SHALL render a link to that store's settings page at `/merchant/stores/{store}/settings`.
5. THE store list SHALL include a "Create store" button that navigates to `/merchant/stores/create`.
6. WHEN `bootstrapStore.stores` is empty, THE store list SHALL render an empty state with a prompt to create the first store via the `/setup` flow.
7. THE store list SHALL read store data exclusively from `bootstrapStore.stores` without making additional API calls to list stores.

---

### Requirement 6: Multi-Store Creation Flow

**User Story:** As a merchant who already has at least one store, I want to create additional stores inside the workspace so that I do not have to go through the first-store setup flow again.

#### Acceptance Criteria

1. WHEN a merchant with `bootstrapStore.stores.length >= 1` navigates to `/merchant/stores/create`, THE Workspace_Shell SHALL render the store creation form inside the workspace layout.
2. THE store creation form at `/merchant/stores/create` SHALL reuse the existing `CreateStoreStep` component from `src/features/setup/components/CreateStoreStep.tsx`.
3. WHEN `CreateStoreStep` calls `onSuccess` inside the workspace context, THE Workspace_Shell SHALL NOT redirect to `/setup` and SHALL instead transition to the Workspace_Provisioning_View.
4. WHEN a merchant with `bootstrapStore.stores.length === 0` navigates to `/merchant/stores/create`, THE Workspace_Shell SHALL redirect the merchant to `/setup` because the first-store flow is handled there.
5. THE `CreateStoreStep` component SHALL NOT be modified to support the workspace context; the workspace SHALL pass an appropriate `onSuccess` callback that drives workspace-internal navigation.
6. WHEN store creation fails with a non-retryable error, THE Workspace_Shell SHALL display the error inline within the workspace layout without redirecting to `/setup`.

---

### Requirement 7: Workspace Provisioning View

**User Story:** As a merchant creating an additional store inside the workspace, I want to see provisioning progress inside the workspace so that I am not redirected out of the workspace to the setup flow.

#### Acceptance Criteria

1. WHEN `bootstrapStore.provisioning.tracked_store_id` is set and `needsProvisioningFlow(bootstrap, provisioning)` returns `true` and the merchant is inside the workspace, THE Workspace_Shell SHALL render the Workspace_Provisioning_View inside the workspace layout.
2. THE Workspace_Provisioning_View SHALL reuse the existing `ProvisioningStep` component from `src/features/setup/components/ProvisioningStep.tsx`.
3. WHEN `ProvisioningStep` would normally redirect to `ROUTES.store(storeId).dashboard()` after provisioning completes, THE Workspace_Provisioning_View SHALL instead redirect to `/merchant/dashboard`.
4. THE `ProvisioningStep` component SHALL NOT be modified to support the workspace context; the workspace SHALL intercept the redirect by overriding the post-completion navigation target.
5. WHILE provisioning is in progress inside the workspace, THE Store_Switcher SHALL remain visible but SHALL disable store switching.
6. WHEN provisioning completes and the new store becomes active, THE Workspace_Shell SHALL refresh `bootstrapStore` and update the Store_Switcher to reflect the new active store.

---

### Requirement 8: Store Settings Page

**User Story:** As a merchant, I want to edit my store's name and basic metadata so that I can keep store information up to date.

#### Acceptance Criteria

1. WHEN a merchant navigates to `/merchant/stores/{store}/settings`, THE Workspace_Shell SHALL render a settings form for the store identified by `{store}`.
2. THE store settings form SHALL allow editing the store's `name` field using `PUT /api/v1/stores/{store}`.
3. THE store settings form SHALL NOT include a slug editing field; slug editing is deferred and out of scope.
4. WHEN the merchant submits the settings form with a valid name, THE Store_Settings page SHALL call `PUT /api/v1/stores/{store}` and display a success confirmation.
5. IF `PUT /api/v1/stores/{store}` returns a validation error, THEN THE Store_Settings page SHALL display field-level error messages inline without navigating away.
6. WHEN the store settings update succeeds, THE bootstrapStore SHALL be refreshed so that the updated store name is reflected in the Store_Switcher and sidebar.
7. THE store settings form SHALL validate that the store name is at least 3 characters before enabling form submission.
8. WHEN a merchant navigates to `/merchant/stores/{store}/settings` for a store that does not belong to `bootstrapStore.stores`, THE Workspace_Shell SHALL render a not-found state.

---

### Requirement 9: Active Store State Management

**User Story:** As a merchant, I want my active store selection to persist across page refreshes so that I do not have to re-select my store every time I return to the workspace.

#### Acceptance Criteria

1. THE Active_Store SHALL be determined exclusively by `bootstrapStore.activeStore`, which is populated from the Bootstrap response (`GET /api/v1/me`).
2. WHEN a merchant refreshes the workspace, THE BootstrapProvider SHALL re-fetch bootstrap and restore `bootstrapStore.activeStore` from the server response without requiring any client-side persistence.
3. WHEN `bootstrapStore.switchStore(storeId)` completes, THE bootstrapStore SHALL update `activeStore` from the `PATCH /api/v1/users/auth/active-store` response without requiring a separate bootstrap re-fetch, consistent with the existing `switchStore` implementation.
4. THE workspace SHALL NOT introduce any additional client-side persistence layer (localStorage, sessionStorage, cookies) for active store state beyond what `bootstrapStore` already manages.
5. WHEN `bootstrapStore.activeStore` changes, all workspace components that read `selectActiveStore` SHALL reactively update without requiring a page reload.
6. THE workspace SHALL scope all store-specific API calls using the `storeId` from `bootstrapStore.activeStore.id`, consistent with the existing `API_ROUTES.store(storeId)` pattern.

---

### Requirement 10: Bootstrap Routing Guard Extension

**User Story:** As a platform, I want the existing bootstrap routing guard to be extended to cover `/merchant/*` routes so that all workspace access control is centralized in one place.

#### Acceptance Criteria

1. THE `resolveBootstrapAccessState` function in `src/lib/auth/bootstrap-routing.ts` SHALL remain the canonical resolver for all routing decisions; the workspace SHALL not introduce a parallel routing guard.
2. WHEN `resolveBootstrapAccessState` returns `kind === 'ready'`, THE BootstrapProvider SHALL permit access to `/merchant/*` routes.
3. WHEN `resolveBootstrapAccessState` returns `kind === 'create_store'` or `kind === 'pending_verification'`, THE BootstrapProvider SHALL redirect to `ROUTES.setup()`.
4. WHEN `resolveBootstrapAccessState` returns `kind === 'provisioning'` and the merchant is not already inside the workspace provisioning view, THE BootstrapProvider SHALL redirect to `ROUTES.setup()`.
5. WHEN `resolveBootstrapAccessState` returns `kind === 'blocked'`, THE BootstrapProvider SHALL redirect to `ROUTES.dashboard.home()` consistent with the existing blocked-store behavior.
6. THE `ROUTES` configuration SHALL be extended with a `merchant` key so that all `/merchant/*` paths are referenced through typed helpers and never hardcoded.
7. THE BootstrapProvider SHALL classify `/merchant/*` paths as protected routes by checking `strippedPath.startsWith('/merchant')`, consistent with how it currently checks `strippedPath.startsWith('/stores/')`.

---

### Requirement 11: Backward Compatibility

**User Story:** As a platform, I want the merchant workspace to be additive so that the existing `/setup` flow, `/stores/{storeId}/*` dashboard routes, and all existing backend contracts remain unchanged.

#### Acceptance Criteria

1. THE Setup_Flow at `/setup` SHALL continue to function without modification for first-store creation and provisioning.
2. THE existing `(dashboard)` route group at `src/app/[locale]/(dashboard)/stores/[storeId]/*` SHALL remain intact and SHALL NOT be removed or redirected.
3. THE `bootstrapStore`, `BootstrapProvider`, `resolveBootstrapAccessState`, `needsProvisioningFlow`, and `useProvisioningStatus` SHALL NOT have their existing behavior changed; the workspace SHALL only extend them.
4. THE `CreateStoreStep` and `ProvisioningStep` components SHALL NOT be modified; the workspace SHALL compose them with workspace-specific callbacks.
5. THE existing `API_ROUTES` and `ROUTES` entries SHALL NOT be removed or renamed; new merchant workspace entries SHALL be added alongside existing ones.
6. THE existing `StoreSwitcher` component in `src/features/dashboard/shell/topbar/StoreSwitcher.tsx` SHALL be extended or replaced in the workspace context to include the "Add store" option, without breaking its current behavior in the existing `(dashboard)` shell.
7. WHEN a merchant is on an existing `/stores/{storeId}/*` route, THE existing routing and layout behavior SHALL be unchanged.

---

### Requirement 12: Future-Proofing Architecture

**User Story:** As a platform architect, I want the merchant workspace architecture to support future capabilities without requiring structural rewrites so that the platform can evolve incrementally.

#### Acceptance Criteria

1. THE `(merchant)` route group layout SHALL accept a `params` prop that can be extended to include organization or team identifiers in the future without restructuring the route group.
2. THE workspace navigation structure SHALL be driven by a configuration object or typed nav items array so that new sections (billing, themes, domains, notifications) can be added by extending the configuration without modifying the shell component.
3. THE Store_Settings page SHALL be implemented as a standalone feature module under `src/features/merchant/` so that additional settings sections (domains, billing, themes) can be added as new sub-sections without modifying the base settings page.
4. THE workspace SHALL use the `bootstrapStore.bootstrap.features` flag map for any feature-gated workspace capabilities, consistent with the existing `FEATURES` config pattern.
5. THE workspace routing helpers added to `ROUTES.merchant` SHALL be structured to accommodate future sub-routes (e.g., `ROUTES.merchant.stores.settings(storeId)`) without breaking existing call sites.
