# Implementation Plan: Merchant Workspace

## Overview

This plan implements the merchant workspace — a persistent multi-store SaaS application shell at `/merchant` — as an additive evolution on top of the existing `/setup` flow and `/stores/{storeId}/*` dashboard routes. Nothing existing is broken or removed. Tasks are ordered by dependency and each is independently verifiable.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": [1] },
    { "wave": 2, "tasks": [2, 3, 4, 5, 6, 7, 17] },
    { "wave": 3, "tasks": [8, 18] },
    { "wave": 4, "tasks": [9, 10, 11, 12, 13, 15, 19] },
    { "wave": 5, "tasks": [14, 16, 20, 21] },
    { "wave": 6, "tasks": [22] },
    { "wave": 7, "tasks": [23] }
  ]
}
```

## Tasks

- [ ] 1. Extend ROUTES and API_ROUTES with merchant workspace entries
  - Add `ROUTES.merchant` typed helpers to `src/config/routes.ts`
  - Add `API_ROUTES.merchant.stores.update(store)` and `API_ROUTES.merchant.stores.detail(store)` to `src/config/routes.ts`
  - Add `UpdateStorePayload` interface to `src/types/store.ts`
  - Add `updateStore()` function to `src/lib/api/stores.ts` using `clientApi.put`
  - Add `queryKeys.merchant.store(storeId)` key family to `src/lib/queryKeys.ts`
  - Verify no existing ROUTES or API_ROUTES entries are modified or removed
  - **Requirements:** 4.7, 8.2, 9.6, 10.6, 11.5, 12.5

- [ ] 2. Extend BootstrapProvider to protect /merchant/* routes
  - Add `strippedPath.startsWith('/merchant')` to the `isProtectedRoute` check in `src/components/providers/BootstrapProvider.tsx`
  - Add a `isMerchantRoute` boolean derived from `strippedPath.startsWith('/merchant')`
  - In the `redirectTarget` memo: when `isMerchantRoute` and `accessState.kind === 'ready'`, return `null` (permit access)
  - When `isMerchantRoute` and `accessState.kind` is `create_store`, `pending_verification`, or `provisioning`, return `ROUTES.setup()`
  - When `isMerchantRoute` and `accessState.kind === 'blocked'`, return `ROUTES.dashboard.home()`
  - When `isMerchantRoute` and `!isAuthenticated`, redirect to login (already handled by existing `isProtectedRoute` logic)
  - Add `isMerchantRoute` to the `refreshBootstrap` visibility check so bootstrap refreshes on tab focus for workspace routes
  - Run `getDiagnostics` on `BootstrapProvider.tsx` after changes
  - **Requirements:** 2.1–2.6, 10.1–10.7

- [ ] 3. Extend middleware to protect /merchant/* at the edge
  - In `src/middleware.ts`, add `strippedPath.startsWith('/merchant')` to the `isDashboardRoute` check (or create a parallel `isWorkspaceRoute` check with identical redirect logic)
  - Ensure unauthenticated requests to `/merchant/*` are redirected to `/${locale}/login` with a `redirect` param
  - Verify existing `/stores/*` protection is unchanged
  - **Requirements:** 2.1, 2.5

- [ ] 4. Create WorkspaceSidebarNav component
  - Create `src/features/merchant/components/WorkspaceSidebarNav.tsx` as a `'use client'` component
  - Define a `WorkspaceNavItem` interface with `label`, `href`, `icon`, `permissionKey?`, `exact?` fields
  - Define the nav items array using `ROUTES.merchant.*` routes: Dashboard, Stores, Orders, Products
  - Gate items with `useCan()` from `bootstrapStore` matching the existing `SidebarNav` permission pattern
  - Use `SidebarNavItem` from `src/features/dashboard/shell/sidebar/SidebarNavItem.tsx` for each item
  - Use `usePathname` for active route detection
  - Use `useUiStore(selectSidebarCollapsed)` for collapsed state
  - Use `useTranslations('nav')` for labels (reuse existing translation keys where possible)
  - **Requirements:** 1.1, 1.3, 4.1, 4.5, 12.2

- [ ] 5. Create WorkspaceStoreSwitcher component
  - Create `src/features/merchant/components/WorkspaceStoreSwitcher.tsx` as a `'use client'` component
  - Read `stores`, `activeStore`, `bootstrap`, and `provisioning` from `bootstrapStore`
  - Use `useSwitchStore` from `src/hooks/auth/useSwitchStore.ts` for the switch mutation
  - Render all stores from `bootstrapStore.stores` in a dropdown (not just active ones — show all with status badges)
  - Active stores (`status === 'active' && is_active === true`): selectable `SelectItem`
  - Non-active stores: rendered as disabled `SelectItem` with a status badge
  - Add a separator and an "Add store" item at the bottom that navigates to `ROUTES.merchant.stores.create()`
  - While `switchStoreMutation.isPending`: disable trigger, show `Loader2` spinner
  - While `needsProvisioningFlow(bootstrap, provisioning)` is true: disable entire switcher
  - Import `needsProvisioningFlow` from `src/lib/auth/bootstrap-routing`
  - Run `getDiagnostics` after creation
  - **Requirements:** 3.1–3.8, 7.5

- [ ] 6. Create WorkspaceEmptyState component
  - Create `src/features/merchant/components/WorkspaceEmptyState.tsx` as a `'use client'` component
  - Render a centered empty state with a message and a link to `ROUTES.merchant.stores.list()` when `activeStore` is null on content routes
  - Accept an optional `message` prop for context-specific messaging
  - **Requirements:** 4.6

- [ ] 7. Create WorkspaceProvisioningView component
  - Create `src/features/merchant/components/WorkspaceProvisioningView.tsx` as a `'use client'` component
  - Render `ProvisioningStep` from `src/features/setup/components/ProvisioningStep.tsx` inside a wrapper div
  - Add a `useEffect` that watches `bootstrap.active_store` and `provisioning.status` from `bootstrapStore`
  - When `provisioning.status === 'completed'` and `isBootstrapStoreReady(bootstrap.active_store)` is true, call `router.push(ROUTES.merchant.dashboard())` — this fires before `ProvisioningStep`'s own redirect effect because the wrapper is higher in the tree
  - Import `isBootstrapStoreReady` from `src/lib/auth/bootstrap-routing`
  - Do NOT modify `ProvisioningStep`
  - Run `getDiagnostics` after creation
  - **Requirements:** 7.1–7.6, 11.4

- [ ] 8. Create the (merchant) route group layout
  - Audit `src/features/dashboard/shell/sidebar/Sidebar.tsx` to understand how `SidebarNav` is rendered and whether it accepts a slot/children prop
  - Audit `src/features/dashboard/shell/topbar/Topbar.tsx` to understand how `StoreSwitcher` is rendered and whether it accepts a slot prop
  - Create `src/app/[locale]/(merchant)/layout.tsx` as an async server component
  - Mirror the pattern from `src/app/[locale]/(dashboard)/stores/[storeId]/layout.tsx`: read `x-tenant-slug` from `headers()`, render `TenantInitializer` and `DashboardShell`
  - The layout does NOT pass `storeId` — workspace is store-context-agnostic at layout level
  - If `Sidebar` and `Topbar` accept slot props: pass `WorkspaceSidebarNav` and `WorkspaceStoreSwitcher` as slots
  - If not: defer slot wiring to tasks 20 and 21; for now render `DashboardShell` with children only
  - Run `getDiagnostics` after creation
  - **Requirements:** 1.1–1.8, 12.1

- [ ] 9. Create /merchant root page (redirect to /merchant/dashboard)
  - Create `src/app/[locale]/(merchant)/merchant/page.tsx`
  - Server component that calls `redirect(`/${locale}/merchant/dashboard`)` using `getLocale()` from `next-intl/server`
  - **Requirements:** 2.4

- [ ] 10. Create /merchant/dashboard page
  - Create `src/app/[locale]/(merchant)/merchant/dashboard/page.tsx`
  - Client component that reads `activeStore` from `bootstrapStore`
  - If `activeStore` is null: render `WorkspaceEmptyState`
  - If `activeStore` is set: render the active store's dashboard overview — reuse the existing dashboard overview component from `src/features/dashboard/dashboard-overview/` scoped to `activeStore.id`
  - **Requirements:** 4.1, 4.2, 4.6

- [ ] 11. Create /merchant/orders page
  - Create `src/app/[locale]/(merchant)/merchant/orders/page.tsx`
  - Client component that reads `activeStore` from `bootstrapStore`
  - If `activeStore` is null: render `WorkspaceEmptyState` with orders-specific message
  - If `activeStore` is set: render the orders list component from `src/features/dashboard/orders/` scoped to `activeStore.id`
  - **Requirements:** 4.1, 4.3, 4.6

- [ ] 12. Create /merchant/products page
  - Create `src/app/[locale]/(merchant)/merchant/products/page.tsx`
  - Client component that reads `activeStore` from `bootstrapStore`
  - If `activeStore` is null: render `WorkspaceEmptyState` with products-specific message
  - If `activeStore` is set: render the products list component from `src/features/dashboard/products/` scoped to `activeStore.id`
  - **Requirements:** 4.1, 4.4, 4.6

- [ ] 13. Create StoreList and StoreListItem components
  - Create `src/features/merchant/stores/StoreListItem.tsx` — renders a single store row with name, slug, status badge, and a settings link for active stores
  - Status badge variants: `active` → green/success, `provisioning`/`pending_setup` → yellow/warning, `disabled`/`suspended` → orange/destructive, `archived` → gray/secondary
  - Settings link uses `ROUTES.merchant.stores.settings(String(store.id))`
  - Create `src/features/merchant/stores/StoreList.tsx` — renders the full list from a `stores` prop, or an empty state when `stores` is empty
  - Empty state: if `stores.length === 0`, link to `/setup`; otherwise link to `ROUTES.merchant.stores.create()`
  - Run `getDiagnostics` after creation
  - **Requirements:** 5.1–5.7

- [ ] 14. Create /merchant/stores page
  - Create `src/app/[locale]/(merchant)/merchant/stores/page.tsx`
  - Client component that reads `stores` from `bootstrapStore`
  - Render `StoreList` with the stores array
  - Include a "Create store" button linking to `ROUTES.merchant.stores.create()`
  - **Requirements:** 5.1–5.7

- [ ] 15. Create CreateStorePage feature component
  - Create `src/features/merchant/stores/CreateStorePage.tsx` as a `'use client'` component
  - Read `stores` from `bootstrapStore`
  - If `stores.length === 0`: redirect to `ROUTES.setup()` (first-store flow)
  - If `stores.length >= 1`: render `CreateStoreStep` from `src/features/setup/components/CreateStoreStep.tsx` with an `onSuccess` callback
  - The `onSuccess` callback sets local `showProvisioning` state to `true` — does NOT navigate to `/setup`
  - When `showProvisioning` is `true`: render `WorkspaceProvisioningView` instead of the form
  - Do NOT modify `CreateStoreStep`
  - Run `getDiagnostics` after creation
  - **Requirements:** 6.1–6.6, 11.4

- [ ] 16. Create /merchant/stores/create page
  - Create `src/app/[locale]/(merchant)/merchant/stores/create/page.tsx`
  - Thin page component that renders `CreateStorePage` from `src/features/merchant/stores/CreateStorePage.tsx`
  - **Requirements:** 6.1

- [ ] 17. Create useUpdateStore hook
  - Create `src/features/merchant/settings/useUpdateStore.ts` as a `'use client'` module
  - Use `useMutation` from TanStack Query
  - `mutationFn`: calls `updateStore(storeId, payload)` from `src/lib/api/stores.ts`
  - `onSuccess`: invalidates `queryKeys.merchant.store(storeId).detail()`, then calls `bootstrapStore.fetchBootstrap()` to refresh the store name in the switcher
  - `onError`: surfaces `apiError.message` via `toast.error`
  - Export: `function useUpdateStore(storeId: string): UseMutationResult<ApiResponse<Store>, ApiError, UpdateStorePayload>`
  - Run `getDiagnostics` after creation
  - **Requirements:** 8.4–8.6

- [ ] 18. Create StoreSettingsForm component
  - Create `src/features/merchant/settings/StoreSettingsForm.tsx` as a `'use client'` component
  - Props: `{ store: Store }`
  - Use `react-hook-form` + `zodResolver` with schema `z.object({ name: z.string().min(3, '...') })`
  - Default value: `store.name`
  - On submit: call `useUpdateStore(String(store.id)).mutate({ name })`
  - On success: show `toast.success` confirmation
  - On API error: map `apiError.errors.name?.[0]` to the `name` field via `setError`; show top-level `formError` for non-field errors
  - Do NOT include a slug field
  - Submit button disabled when `!isValid || isPending`
  - Run `getDiagnostics` after creation
  - **Requirements:** 8.1–8.8

- [ ] 19. Create /merchant/stores/[store]/settings page
  - Create `src/app/[locale]/(merchant)/merchant/stores/[store]/settings/page.tsx`
  - Client component that reads `stores` from `bootstrapStore`
  - Extract `store` param from `useParams()`
  - Find the matching store: `stores.find(s => String(s.id) === store || s.slug === store)`
  - If not found: render an inline not-found state (not a 404 page)
  - If found: render `StoreSettingsForm` with the matched store
  - **Requirements:** 8.1, 8.8

- [ ] 20. Wire WorkspaceSidebarNav into the workspace shell
  - Read `src/features/dashboard/shell/sidebar/Sidebar.tsx` to determine if it accepts a nav slot or children
  - If `Sidebar` accepts a `nav` prop or children: update the workspace layout to pass `WorkspaceSidebarNav` via that prop
  - If not: create `src/features/merchant/components/WorkspaceSidebar.tsx` that wraps `Sidebar` and injects `WorkspaceSidebarNav` — update the workspace layout to use `WorkspaceSidebar` instead of relying on `DashboardShell`'s default sidebar
  - Ensure the existing `(dashboard)` shell and `SidebarNav` are completely unaffected
  - Run `getDiagnostics` on all modified files
  - **Requirements:** 1.1, 1.3, 1.8, 11.2, 11.7

- [ ] 21. Wire WorkspaceStoreSwitcher into the workspace topbar
  - Read `src/features/dashboard/shell/topbar/Topbar.tsx` to determine if it accepts a switcher slot
  - If `Topbar` accepts a `switcher` prop: update the workspace layout to pass `WorkspaceStoreSwitcher` via that prop
  - If not: create `src/features/merchant/components/WorkspaceTopbar.tsx` that wraps `Topbar` and injects `WorkspaceStoreSwitcher` — update the workspace layout to use `WorkspaceTopbar`
  - Ensure the existing `(dashboard)` topbar and `StoreSwitcher` are completely unaffected
  - Run `getDiagnostics` on all modified files
  - **Requirements:** 1.1, 1.3, 3.8, 11.6

- [ ] 22. Verify backward compatibility
  - Confirm `src/app/[locale]/(auth)/setup/page.tsx` renders correctly (no changes expected)
  - Confirm `src/app/[locale]/(dashboard)/stores/[storeId]/layout.tsx` renders correctly (no changes expected)
  - Confirm `src/features/setup/components/CreateStoreStep.tsx` is unmodified
  - Confirm `src/features/setup/components/ProvisioningStep.tsx` is unmodified
  - Confirm `src/stores/bootstrapStore.ts` existing behavior is unchanged
  - Run `getDiagnostics` on `src/config/routes.ts`, `src/lib/api/stores.ts`, `src/lib/queryKeys.ts`, `src/types/store.ts`, `src/components/providers/BootstrapProvider.tsx`, `src/middleware.ts`
  - **Requirements:** 11.1–11.7

- [ ] 23. Write documentation
  - Create `docs/frontend/merchant-workspace-architecture.md` — workspace model, route group structure, shell composition, feature module layout, future extensibility
  - Create `docs/frontend/store-switching.md` — store switcher lifecycle, `useSwitchStore` hook, active store update flow, multi-tab sync
  - Create `docs/frontend/active-store-context.md` — active store ownership, bootstrap as source of truth, no client-side persistence, reactive updates
  - Create `docs/frontend/multi-store-flow.md` — setup vs workspace distinction, first-store vs additional-store creation paths, provisioning inside workspace
  - **Requirements:** 12.1–12.5

## Notes

- Tasks 20 and 21 (sidebar/topbar wiring) depend on auditing `Sidebar.tsx` and `Topbar.tsx` in task 8. If those components already accept slot props, tasks 20 and 21 collapse into task 8. If not, they require creating thin wrapper components — this is the expected path given the current `DashboardShell` implementation.
- The `useSwitchStore` hook already redirects to `resolveBootstrapAccessState(bootstrap).redirectPath` on success. Inside the workspace, this will resolve to `ROUTES.merchant.dashboard()` once `ROUTES.merchant` is added and `resolveBootstrapAccessState` returns `kind === 'ready'` with the merchant path. No changes to `useSwitchStore` are needed.
- `ProvisioningStep` currently redirects to `ROUTES.store(storeId).dashboard()` on completion. `WorkspaceProvisioningView` intercepts this by firing its own redirect first (parent `useEffect` runs before child `useEffect` in React's commit phase ordering). This is a safe composition pattern — no modification to `ProvisioningStep` is needed.
- The `(merchant)` route group folder name does not appear in the URL. The actual URL segment is `merchant` from the `merchant/` subfolder inside the route group.
