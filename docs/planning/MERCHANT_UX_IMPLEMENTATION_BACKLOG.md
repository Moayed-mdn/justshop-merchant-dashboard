# Merchant UX Implementation Backlog

## Purpose

This document converts the merchant UX plan into an execution backlog for Cursor.

Use this file together with:

- `docs/planning/MERCHANT_UX_OPTIMIZATION_PLAN.md`

This backlog is organized by priority:

- `P0`: stabilize merchant UX foundations
- `P1`: improve clarity, trust, and comfort
- `P2`: polish repeated workflows and onboarding depth

Each ticket includes:

- objective
- implementation scope
- likely files
- tasks
- acceptance criteria
- dependencies

---

## Delivery Order

Cursor should implement in this order:

1. `P0-1` through `P0-5`
2. `P1-1` through `P1-5`
3. `P2-1` through `P2-3`

Do not start P1 before the core route and loading stability work in P0 is complete.

---

## P0 Backlog

## P0-1: Canonicalize Merchant Navigation

### Objective

Ensure merchant-facing UI uses `/merchant/*` routes as the default navigation model.

### Why

Merchants should not click into legacy `/stores/[id]/*` routes and then be redirected back into the workspace.

### Likely Files

- `src/config/routes.ts`
- `src/features/dashboard/products/ProductsTable.tsx`
- `src/features/dashboard/categories/CategoriesTable.tsx`
- merchant pages and components under `src/app/[locale]/(merchant)/merchant/**`
- shared components that still use `ROUTES.store(storeId)`

### Tasks

- audit all merchant-facing links that still use `ROUTES.store(storeId)`
- replace those links with `ROUTES.merchant.*` equivalents
- confirm list, create, edit, and detail flows use canonical workspace routing
- add or update comments in route helpers to make `/merchant/*` the rule for merchant UI
- leave legacy routes intact only for compatibility fallback

### Acceptance Criteria

- merchants no longer hit legacy store-scoped routes during normal dashboard usage
- products, categories, brands, tags, orders, hero banners, and customers open through `/merchant/*`
- legacy route usage is reduced to direct URL fallback or compatibility only

### Dependencies

- none

---

## P0-2: Reduce Redirect-Driven Full-Screen Loading

### Objective

Keep merchants inside the shell during routine bootstrap and context transitions.

### Why

The app currently feels unstable because it often drops into full-screen loading states instead of preserving context.

### Likely Files

- `src/components/providers/BootstrapProvider.tsx`
- `src/lib/auth/bootstrap-routing.ts`
- `src/features/dashboard/shell/DashboardShell.tsx`
- `src/features/merchant/components/WorkspaceEmptyState.tsx`

### Tasks

- identify all cases where `BootstrapProvider` forces a full-screen loading state
- split hard auth redirects from soft merchant-context refresh cases
- keep the shell visible for recoverable merchant flows
- use inline status UI, page skeletons, or contained loading states instead of full-screen takeovers
- keep full-screen behavior only for true unauthenticated or unrecoverable boundaries

### Acceptance Criteria

- routine merchant navigation does not show blank full-screen session recovery screens
- merchant pages preserve top bar and sidebar during soft refresh states
- merchant context recovery feels like a transition, not a reset

### Dependencies

- none

---

## P0-3: Convert Legacy Route Redirectors Into Background Compatibility

### Objective

Minimize the visible UX cost of legacy route adapters.

### Why

Even if legacy routes remain temporarily, merchants should not feel the redirect adapter layer.

### Likely Files

- `src/features/merchant/components/LegacyLayoutRedirector.tsx`
- `src/features/merchant/components/LegacyRouteRedirector.tsx`
- `src/app/[locale]/(dashboard)/stores/[storeId]/layout.tsx`

### Tasks

- reduce the visual prominence of redirect adapter screens
- if possible, preserve shell and show compact in-context messaging
- improve fallback messaging when store hydration fails
- make sure redirectors are compatibility-only and not part of normal merchant-generated flows
- verify store mismatch handling does not feel like a hard reset

### Acceptance Criteria

- legacy redirectors are no longer a common visible step in regular merchant usage
- direct legacy URL entry is handled gracefully
- failure paths are understandable and recoverable

### Dependencies

- `P0-1`
- `P0-2`

---

## P0-4: Redesign Setup Copy and Flow Framing

### Objective

Make setup feel guided, reassuring, and low-stress.

### Why

The current setup architecture is solid, but the presentation feels technical and heavy.

### Likely Files

- `src/features/setup/components/SetupOrchestrator.tsx`
- `src/features/setup/components/CreateStoreStep.tsx`
- `src/features/setup/components/ProvisioningStep.tsx`

### Tasks

- rewrite setup titles, descriptions, and recovery text
- add visible step framing or progress language
- demote technical recovery actions to secondary placement
- simplify provisioning messaging
- replace operational wording with calm, human-oriented copy
- ensure draft restore messaging feels helpful rather than alarming

### Acceptance Criteria

- setup reads like a guided onboarding flow
- merchants understand the current step and next step
- copy reduces anxiety and technical burden
- manual recovery actions no longer dominate the primary UI

### Dependencies

- none

---

## P0-5: Improve Setup Completion Handoff

### Objective

Ensure setup completion transitions into meaningful merchant action.

### Why

A generic redirect after provisioning wastes the moment when merchants are most ready for direction.

### Likely Files

- `src/features/setup/components/ProvisioningStep.tsx`
- `src/features/setup/components/SetupOrchestrator.tsx`
- merchant dashboard landing components

### Tasks

- replace generic "store is ready" redirect framing with a clearer success handoff
- decide what first action should be highlighted after setup:
  - create first product
  - review dashboard
  - customize storefront
- add post-setup guidance for the first useful task
- make completion feel intentional instead of automatic and abrupt

### Acceptance Criteria

- merchants understand what to do immediately after setup
- completion messaging feels celebratory and clear
- the first post-setup route feels purposeful

### Dependencies

- `P0-4`

---

## P1 Backlog

## P1-1: Add Merchant Page Header Pattern

### Objective

Improve orientation on core merchant pages.

### Why

Pages currently risk feeling like raw surfaces without enough context or explanation.

### Likely Files

- merchant route pages under `src/app/[locale]/(merchant)/merchant/**`
- reusable UI or layout layer if a shared page header component is added

### Tasks

- define a reusable page header pattern
- include title, short purpose text, and optional actions
- add active store context where relevant
- add optional breadcrumb treatment for deeper routes
- apply first to the highest-traffic pages

### First Pages

- dashboard
- products
- categories
- orders
- stores
- settings

### Acceptance Criteria

- core pages have a consistent header pattern
- merchants can immediately tell what page they are on and what it is for

### Dependencies

- `P0-1`

---

## P1-2: Improve Empty States and Next-Step Guidance

### Objective

Make empty and blocked states more helpful.

### Why

Merchants should never see an empty page without understanding what action to take next.

### Likely Files

- `src/features/merchant/components/WorkspaceEmptyState.tsx`
- list and overview components in products, categories, orders, stores, and dashboard modules

### Tasks

- standardize empty-state structure
- explain why the state is empty
- give one primary next action
- add context-specific empty states instead of overly generic ones
- improve blocked and no-active-store messaging

### Acceptance Criteria

- empty states are specific to the page context
- every empty state has one clear next step
- blocked states explain what the merchant can and cannot do

### Dependencies

- `P0-2`

---

## P1-3: Remove or Replace Trust-Breaking Top-Bar Placeholders

### Objective

Ensure every top-bar control is useful and credible.

### Why

Disabled or fake controls weaken trust in the product.

### Likely Files

- `src/features/dashboard/shell/topbar/Topbar.tsx`

### Tasks

- remove fake search placeholder unless real search is ready
- remove or hide disabled notifications unless they deliver value
- optionally replace with:
  - quick actions
  - help entry point
  - current store context
- verify the top bar still feels balanced after cleanup

### Acceptance Criteria

- no obviously fake or disabled placeholder controls remain in the top bar
- all visible controls are useful

### Dependencies

- none

---

## P1-4: Improve Store Switcher Clarity and Feedback

### Objective

Make store switching feel understandable, safe, and low-friction.

### Why

Store switching is a core part of merchant navigation and should feel smooth.

### Likely Files

- `src/features/merchant/components/WorkspaceStoreSwitcher.tsx`
- `src/features/dashboard/shell/DashboardShell.tsx`
- store-switch-related hooks and store state

### Tasks

- improve disabled-store messaging
- add clearer explanations for statuses like provisioning, suspended, archived, or disabled
- reduce blocking feel during store switch
- provide better success/progress feedback
- ensure current active store is always easy to understand

### Acceptance Criteria

- merchants can tell which stores are selectable and why
- switching feels smoother and less disruptive
- progress and completion feedback are clear

### Dependencies

- `P0-2`

---

## P1-5: Improve Store List and Settings Self-Service

### Objective

Make store management feel more complete and less support-dependent.

### Why

Store cards and settings should help merchants act confidently without unnecessary escalation.

### Likely Files

- `src/features/merchant/stores/StoreListItem.tsx`
- `src/features/merchant/settings/StoreSettingsForm.tsx`
- store settings routes and related hooks

### Tasks

- improve store list cards with clearer status meaning
- refine store card action labels and messaging
- improve save feedback in settings
- revisit slug-edit UX:
  - direct edit if safe
  - or structured change flow if direct edit is risky
- reduce reliance on "contact support" for basic store management

### Acceptance Criteria

- merchants understand the state and options for each store
- settings feel more self-serve
- slug handling is clearer and less frustrating

### Dependencies

- `P1-4`

---

## P2 Backlog

## P2-1: Add Workflow Comfort Improvements

### Objective

Reduce friction in repeated merchant workflows.

### Candidate Areas

- bulk actions
- saved filters
- better long-form draft preservation
- friendlier unsaved changes handling

### Likely Files

- list and editor components across products, categories, orders, brands, and tags

### Tasks

- identify the highest-friction repeated workflows
- implement one or two high-value workflow comfort features first
- favor improvements that reduce repetition and accidental loss of work

### Acceptance Criteria

- repeated merchant tasks feel faster and safer
- merchants lose less work during longer form sessions

### Dependencies

- P0 and P1 stabilization complete

---

## P2-2: Add Post-Onboarding Merchant Checklist

### Objective

Guide new merchants through the first high-value tasks after setup.

### Why

A new merchant should not land in a fully open workspace and have to guess the next move.

### Likely Files

- merchant dashboard landing components
- setup completion handoff components

### Tasks

- define first-run checklist items
- show only for appropriate merchants
- make checklist dismissible and progress-aware
- connect each task to a real destination in the workspace

### Suggested Checklist

- add first product
- create first category
- customize theme
- review store settings
- invite teammate

### Acceptance Criteria

- new merchants see clear next-step guidance
- checklist feels lightweight, not overwhelming

### Dependencies

- `P0-5`

---

## P2-3: Add Merchant UX Metrics and Follow-Up Review

### Objective

Measure whether the UX improvements actually worked.

### Why

The team needs evidence, not only implementation completion.

### Tasks

- instrument the agreed metrics where practical
- compare before and after for:
  - route redirects
  - full-screen loader frequency
  - setup completion timing
  - store switch timing
- run task-based QA review after P0 and P1
- summarize residual friction for future iterations

### Acceptance Criteria

- UX changes are measurable
- there is a short follow-up summary after rollout

### Dependencies

- P0 and P1 changes implemented

---

## Suggested Sprint Packaging

## Sprint 1

- `P0-1`
- `P0-2`
- `P0-3`

### Sprint Goal

Stop the workspace from feeling unstable during normal navigation.

---

## Sprint 2

- `P0-4`
- `P0-5`
- `P1-3`

### Sprint Goal

Make setup calmer and remove trust-breaking shell elements.

---

## Sprint 3

- `P1-1`
- `P1-2`
- `P1-4`
- `P1-5`

### Sprint Goal

Improve orientation, store management comfort, and self-service clarity.

---

## Sprint 4

- `P2-1`
- `P2-2`
- `P2-3`

### Sprint Goal

Polish repeated workflows and validate the UX improvements.

---

## QA Checklist for Cursor

After each major ticket group, verify:

- merchant navigation stays inside `/merchant/*`
- shell remains visible during recoverable transitions
- setup copy feels calm and clear
- current store context is always understandable
- empty states explain the next step
- top-bar controls are useful
- store switching feedback is understandable

---

## Final Rule for Cursor

If a change improves architecture but still feels confusing to the merchant, it is not done yet.

Merchant comfort, clarity, and flow continuity are the main success criteria.
