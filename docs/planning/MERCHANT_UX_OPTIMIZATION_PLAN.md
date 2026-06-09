# Merchant UX Optimization Plan

## Document Purpose

This document is the implementation handoff for improving merchant UX in `laratenant-commerce`.

The goal is to make the merchant workspace feel:

- comfortable
- predictable
- easy to move through
- easy to set up
- easy to recover when something goes wrong

This plan is written for Cursor to implement directly.

It is not a design essay. It is a prioritized execution plan with product intent, code targets, acceptance criteria, and rollout guidance.

---

## Primary UX Goal

Merchants should feel like they are using one stable workspace, not fighting redirects, setup blockers, or uncertain state transitions.

By the end of this plan:

- merchants stay inside one consistent `/merchant/*` mental model
- setup feels guided and reassuring instead of operational
- loading and recovery states stay inside the shell whenever possible
- store switching feels understandable and safe
- empty states and blocked states always explain the next step
- trust-breaking placeholder UI is removed or replaced

---

## Current UX Problems

### 1. Workspace Navigation Is Not Fully Canonical

The app has a canonical merchant workspace, but many actions still route through legacy `/stores/[id]/*` paths and then redirect back into `/merchant/*`.

This creates:

- extra delay
- unstable feeling transitions
- cognitive friction
- duplicated route architecture
- more opportunities for redirect loops and edge-case failures

### 2. Setup Feels Technically Correct but Emotionally Heavy

The current setup flow works as a state machine, but it feels like infrastructure recovery rather than business onboarding.

Problems include:

- full-screen takeover states
- operational copy
- manual retry emphasis
- explicit warnings that increase anxiety
- weak "what happens next" guidance

### 3. Bootstrap and Recovery Are Too Redirect-Driven

The app frequently explains itself by redirecting to a full-screen loader.

This makes the product feel like:

- it is resetting itself
- it is fragile
- it is unsure about the current session

### 4. Shell Trust Is Weakened

The top bar currently exposes fake or disabled capabilities such as search and notifications.

This reduces confidence because merchants see controls that do not truly help them yet.

### 5. Store Management Lacks Comfort Details

Store switching and settings work functionally, but they do not feel friendly.

Problems include:

- terse status labels
- limited explanation of unavailable stores
- blocking overlays
- support-dependent changes for basic fields like slug editing

---

## UX Principles

Cursor should use these rules while implementing:

### 1. Preserve Context

Never remove the shell unless there is no meaningful shell to show.

Prefer:

- inline status
- page skeletons
- panel-level recovery

Avoid:

- blank full-screen loaders
- route-bounce experiences
- sudden session takeovers

### 2. One Mental Model

Merchants should operate inside `/merchant/*`.

Legacy routes may remain temporarily for compatibility, but no active merchant UI should intentionally send users into them.

### 3. Explain the Next Step

Every blocked, empty, loading, and recovery state must answer:

- what is happening
- whether the merchant needs to do anything
- what happens next

### 4. Calm the Language

Copy should reduce stress.

Prefer:

- "We're setting up your store"
- "This usually takes less than a minute"
- "We'll keep checking for you"

Avoid:

- "Refresh bootstrap"
- "Do not resubmit"
- "Recovering setup state from server"
- "Loading dashboard session"

### 5. Remove Fake Affordances

If search and notifications are not useful yet, remove them or replace them with working features.

### 6. Prioritize Merchant Confidence Over Technical Purity

If the backend state is complex, the UI should still feel simple.

The merchant should not have to understand bootstrap, provisioning internals, or redirect adapters.

---

## Scope

### In Scope

- merchant navigation and route experience
- merchant setup and provisioning UX
- bootstrap loading and recovery UX
- top bar trust and clarity
- store switching UX
- store settings UX
- page orientation and empty states
- instrumentation for measuring UX improvements

### Out of Scope for This Pass

- full design system rewrite
- complete information architecture redesign
- advanced merchant analytics features
- broad visual rebranding
- large backend business logic changes unless necessary to support UX continuity

---

## Priority Summary

### P0

- make `/merchant/*` the only merchant mental model
- remove full-screen redirect-driven instability
- redesign setup as guided progress

### P1

- improve page orientation and shell trust
- improve store switching and store status clarity
- improve settings self-service

### P2

- streamline repeated workflows
- add post-onboarding merchant guidance

---

## Implementation Workstreams

## Workstream 1: Canonical Merchant Navigation

### Goal

Make `/merchant/*` the real end-to-end workspace.

### Why This Matters

Merchants should not move from one workspace into a legacy route and then get redirected back.

That creates a broken feeling even when the flow is technically successful.

### Current Code Targets

- `src/config/routes.ts`
- `src/features/dashboard/categories/CategoriesTable.tsx`
- `src/features/dashboard/products/ProductsTable.tsx`
- merchant pages still relying on legacy store route helpers
- legacy compatibility adapters:
  - `src/features/merchant/components/LegacyLayoutRedirector.tsx`
  - `src/features/merchant/components/LegacyRouteRedirector.tsx`
- route trees:
  - `src/app/[locale]/(merchant)/merchant/**`
  - `src/app/[locale]/(dashboard)/stores/[storeId]/**`

### Required Changes

- replace merchant-generated links that use `ROUTES.store(storeId)` with canonical `ROUTES.merchant.*`
- audit product, category, brand, tag, order, hero banner, customer, and store entry flows
- keep `/stores/[storeId]/*` as compatibility-only routes during migration
- stop using legacy route adapters as part of normal merchant usage
- create a clear rule in code comments and docs: merchant UI must link to `/merchant/*`, not `/stores/[id]/*`

### Implementation Notes for Cursor

- start with the high-frequency list and edit flows first:
  - products
  - categories
  - brands
  - tags
  - orders
- add a small route audit checklist in the PR description or follow-up doc
- if a page still depends on store ID context, use active store state internally rather than exposing store-scoped URLs to the merchant

### Acceptance Criteria

- no primary merchant CTA intentionally links to `/stores/[id]/*`
- merchants can navigate products, categories, tags, brands, orders, and settings without legacy route bounces
- legacy redirectors remain only for compatibility and direct URL fallback
- route transitions feel direct and stable

---

## Workstream 2: In-Shell Loading and Recovery

### Goal

Stop explaining app state through full-screen loaders whenever possible.

### Why This Matters

Merchants should feel that the workspace is stable even when the app is refreshing session or store context.

### Current Code Targets

- `src/components/providers/BootstrapProvider.tsx`
- `src/lib/auth/bootstrap-routing.ts`
- `src/features/dashboard/shell/DashboardShell.tsx`
- `src/features/merchant/components/LegacyLayoutRedirector.tsx`
- `src/features/merchant/components/LegacyRouteRedirector.tsx`
- `src/features/merchant/components/WorkspaceEmptyState.tsx`
- `src/features/merchant/components/WorkspaceProvisioningView.tsx`

### Required Changes

- replace full-screen redirect loaders with in-shell status treatments where possible
- preserve sidebar and top bar during:
  - store switch
  - bootstrap refresh
  - route healing
  - ready-state validation
- show page skeletons or section placeholders instead of blank screen takeovers
- change "redirecting to the correct dashboard state" style messaging into calmer inline system notices
- keep full-screen states only for true auth boundaries where the shell cannot be meaningfully rendered

### Suggested UX Pattern

- shell remains visible
- page body shows skeleton or status card
- compact status bar/toast/banner explains what is happening
- if user action is required, show one clear CTA

### Implementation Notes for Cursor

- refactor `BootstrapProvider` so `redirectTarget` does not automatically imply a full-screen loader
- distinguish between:
  - auth-required hard redirects
  - recoverable merchant context refresh
  - store mismatch repair
- keep shell continuity for merchant-only flows

### Acceptance Criteria

- normal merchant flows no longer fall into blank full-screen session loaders
- store switching feels like a transition inside the workspace, not a restart
- recovery and refresh states are understandable without hiding the shell

---

## Workstream 3: Setup as Guided Progress

### Goal

Turn setup into a reassuring guided journey instead of a technical recovery flow.

### Why This Matters

First-time merchant experience sets the emotional tone for the whole product.

### Current Code Targets

- `src/features/setup/components/SetupOrchestrator.tsx`
- `src/features/setup/components/CreateStoreStep.tsx`
- `src/features/setup/components/ProvisioningStep.tsx`
- related setup routes under `src/app/[locale]/(auth)/setup`

### Required Changes

- reshape setup into a clear progression:
  - verify email
  - create store
  - provisioning
  - first action
- reduce emphasis on manual recovery actions
- auto-refresh provisioning and bootstrap status by default
- move technical recovery actions into a secondary expandable or lower-priority area
- rewrite copy to sound calm, human, and time-aware
- add progress framing so the merchant feels they are advancing through setup
- end setup with a meaningful next step instead of a generic redirect

### Specific Copy Direction

Replace wording like:

- "Restoring your setup"
- "Recovering your merchant setup state from the server"
- "Refresh bootstrap"
- "Do not submit again"

With wording like:

- "Let's get your store ready"
- "We're picking up where you left off"
- "We'll keep checking in the background"
- "If setup takes longer than expected, you can try again here"

### Suggested UX Structure

- top section:
  - title
  - short reassurance line
  - progress indicator
- main card:
  - current step
  - clear next action or automatic progress
- support area:
  - only shown when needed
  - minimal technical language

### Implementation Notes for Cursor

- keep the current state-machine architecture
- improve presentation and transitions rather than rewriting logic from scratch
- preserve draft restore behavior, but reframe it as a helpful convenience
- ensure provisioning completion leads into a guided first action, not just a route redirect

### Acceptance Criteria

- setup feels like a guided checklist
- provisioning mostly advances automatically
- recovery actions exist but do not dominate the primary UI
- copy reduces anxiety
- first-time merchants understand what to do next

---

## Workstream 4: Orientation and Wayfinding

### Goal

Help merchants understand where they are and what each page is for.

### Why This Matters

Even when flows work, a workspace can still feel tiring if every page starts cold.

### Current Code Targets

- merchant page components under `src/app/[locale]/(merchant)/merchant/**`
- shell components:
  - `src/features/dashboard/shell/DashboardShell.tsx`
  - `src/features/merchant/components/WorkspaceSidebarNav.tsx`
- empty states and per-page content components

### Required Changes

- introduce a consistent page header pattern
- include:
  - page title
  - short supporting description
  - active store context where relevant
  - optional breadcrumb for deeper flows
- improve empty states so they explain:
  - why the page is empty
  - what the merchant should do next
- standardize action hierarchy with one strong primary CTA per page

### Suggested First Pages to Improve

- dashboard
- products
- categories
- orders
- stores
- settings

### Acceptance Criteria

- major merchant pages have clear headers and purpose
- empty states always include one obvious next step
- merchants can tell which store context they are operating within

---

## Workstream 5: Top Bar Trust and Utility

### Goal

Make the top bar fully credible.

### Why This Matters

The top bar is persistent. If it contains fake features, it quietly teaches merchants not to trust the interface.

### Current Code Targets

- `src/features/dashboard/shell/topbar/Topbar.tsx`

### Required Changes

- remove fake search placeholder unless a real search experience is ready
- remove or hide disabled notifications unless they provide real value
- optionally replace placeholders with:
  - current store context
  - quick actions menu
  - help entry point
  - recent actions launcher

### Decision Rule

Choose one of these paths:

1. ship real functionality
2. hide the control entirely
3. replace it with a useful lightweight control

Do not ship obviously fake controls.

### Acceptance Criteria

- every visible top-bar control is useful
- no disabled placeholder undermines product trust

---

## Workstream 6: Store Switching Comfort

### Goal

Make switching stores feel safe, obvious, and low-stress.

### Why This Matters

In a multi-store workspace, store switching is not a side feature. It is core navigation.

### Current Code Targets

- `src/features/merchant/components/WorkspaceStoreSwitcher.tsx`
- `src/features/merchant/stores/StoreListItem.tsx`
- `src/features/dashboard/shell/DashboardShell.tsx`
- store switching hooks and bootstrap store state

### Required Changes

- improve status explanation for non-ready stores
- replace terse badges with clearer human labels and optional explanations
- remember last active store consistently
- make switch progress non-blocking where safe
- show a smaller in-shell transition rather than a broad overlay
- clearly explain why a store cannot be selected
- improve the stores list card content and action labels

### Suggested UX Improvements

- active store label in the switcher
- secondary text for blocked or provisioning stores
- tooltip or inline explanation for disabled store items
- more informative CTA labels than just "Switch to store" when needed
- success feedback after store switch completes

### Acceptance Criteria

- merchants understand which stores are available and why
- switching feels fast and predictable
- blocked or provisioning stores are explained in plain language

---

## Workstream 7: Store Settings Self-Service

### Goal

Reduce support-dependent friction for basic store management.

### Why This Matters

Being told to contact support for a simple field change makes the product feel unfinished and high-friction.

### Current Code Targets

- `src/features/merchant/settings/StoreSettingsForm.tsx`
- store settings route pages
- related store update hooks and APIs

### Required Changes

- improve the settings form structure and clarity
- expand editable store fields where backend allows it
- revisit slug change handling:
  - either support controlled slug edits
  - or provide a better request/change workflow than "contact support"
- add clearer save feedback and confirmation
- add guidance around downstream effects for fields that affect URLs or storefront identity

### Implementation Notes for Cursor

- if direct slug editing is risky, implement a safer request path:
  - validate slug availability
  - show impact warning
  - require confirmation
- do not leave the merchant at a dead end

### Acceptance Criteria

- settings feel self-serve for common changes
- merchants receive clear feedback after save
- slug handling is clearer and less support-dependent

---

## Workstream 8: Workflow Polish

### Goal

Reduce friction in everyday merchant work after the stabilization pass.

### Candidate Improvements

- bulk actions in list pages
- saved filters
- draft autosave in longer merchant forms
- better unsaved changes UX
- lightweight quick actions

### Priority

Only start after P0 and core P1 work is stable.

---

## Workstream 9: Post-Onboarding Merchant Home

### Goal

Help first-time merchants take the first valuable actions after setup.

### Suggested First-Run Checklist

- finish store setup
- add first product
- create first category
- customize theme
- invite teammate
- review first order flow

### Requirements

- only shown for new merchants or until dismissed
- progress-aware
- actionable
- not visually heavy

---

## Recommended Delivery Phases

## Phase 0: Audit and Guardrails

### Output

- route audit list
- shell state inventory
- copy rewrite inventory
- metric instrumentation plan

### Tasks

- identify every merchant UI entry point that still links to legacy store-scoped routes
- identify every full-screen loading and redirect state in merchant flows
- list every fake, disabled, or placeholder shell affordance
- inventory blocked, empty, and provisioning states

---

## Phase 1: UX Stabilization

### Priority

Highest

### Deliverables

- canonical `/merchant/*` navigation
- reduced redirect dependence
- in-shell loading and store switch continuity
- calmer setup flow

### Tasks

- update route usage in merchant CTAs
- refactor bootstrap-related full-screen loading behavior
- replace legacy-route UX from primary flows
- improve setup copy and progress framing
- demote recovery actions to secondary UI

### Success Signal

Merchant navigation feels direct and setup feels safer.

---

## Phase 2: Orientation and Trust

### Deliverables

- page headers and purpose descriptions
- stronger empty states
- top-bar cleanup
- richer store status messaging

### Tasks

- add reusable merchant page header pattern
- improve store switcher and stores list content
- remove fake search/notifications or replace them
- improve settings feedback and guidance

### Success Signal

Merchants feel less lost and trust the shell more.

---

## Phase 3: Workflow Comfort

### Deliverables

- post-onboarding merchant home
- workflow polish for recurring tasks
- optional saved filters and draft support

### Success Signal

Daily merchant usage feels smoother, not just initial setup.

---

## Cursor Execution Guidelines

Cursor should follow these implementation rules:

### 1. Do Not Rewrite the Whole Architecture First

Prefer incremental improvements that preserve existing business logic and route compatibility.

### 2. Start With High-Impact Friction

Do these first:

- route canonicalization
- bootstrap/full-screen loading reduction
- setup copy and experience improvements

### 3. Keep Compatibility Until Stable

Legacy routes can remain temporarily, but only as fallback paths.

### 4. Reuse Existing Shell and State Systems

Leverage:

- `DashboardShell`
- `BootstrapProvider`
- `bootstrapStore`
- existing setup state machine

Do not create parallel architecture unless necessary.

### 5. Improve Copy as Part of the Implementation

This project needs UX improvements, not only technical rerouting.

Cursor should update user-facing text while implementing flow changes.

### 6. Add Lightweight Instrumentation

Track before/after improvement with basic metrics and event logging where practical.

---

## Suggested Ticket Breakdown

## Ticket Group A: Canonical Routing

- replace merchant-facing legacy links with canonical workspace routes
- audit all route helpers used in merchant pages
- document remaining compatibility-only legacy routes

## Ticket Group B: Bootstrap and Shell Continuity

- reduce full-screen loaders in `BootstrapProvider`
- convert store switch UX to in-shell progress
- preserve shell during merchant context healing

## Ticket Group C: Setup Improvement

- rewrite setup copy
- add visible progress framing
- reduce recovery-action prominence
- improve completion handoff

## Ticket Group D: Orientation

- add reusable page header component or pattern
- improve empty states in core pages
- expose active store context more clearly

## Ticket Group E: Trust and Store Management

- remove fake search/notification controls
- improve store switcher statuses
- improve stores list cards
- improve store settings self-service and guidance

---

## Metrics

Track these before and after implementation:

- time to first usable store
- time to first product creation
- redirect frequency per merchant session
- full-screen loader frequency per merchant session
- store switch completion time
- setup abandonment rate
- support requests related to confusion or being stuck

If analytics are limited, start with lightweight event logging and QA observation.

---

## QA Scenarios

Cursor should verify these user journeys after implementation:

### New Merchant

- sign up
- verify email
- create store
- wait for provisioning
- land in dashboard
- create first product

### Existing Merchant

- open merchant dashboard with ready store
- navigate products, categories, and orders
- switch stores
- open store settings
- recover from temporary bootstrap refresh

### Edge Cases

- provisioning store not ready yet
- blocked store
- no active store
- stale or mismatched route entry
- temporary offline state during setup

---

## Definition of Done

This plan is complete when:

- merchants primarily stay inside `/merchant/*`
- normal flows no longer depend on visible redirect hopping
- setup feels guided and reassuring
- full-screen session loaders are reduced to only truly necessary cases
- the top bar contains only useful controls
- store statuses and switching behavior are clearly explained
- settings feel more self-serve
- metrics and QA scenarios confirm improvement

---

## Recommended File Targets for First Pass

Cursor should start review and implementation in these files:

- `src/config/routes.ts`
- `src/components/providers/BootstrapProvider.tsx`
- `src/lib/auth/bootstrap-routing.ts`
- `src/features/setup/components/SetupOrchestrator.tsx`
- `src/features/setup/components/CreateStoreStep.tsx`
- `src/features/setup/components/ProvisioningStep.tsx`
- `src/features/dashboard/shell/DashboardShell.tsx`
- `src/features/dashboard/shell/topbar/Topbar.tsx`
- `src/features/dashboard/categories/CategoriesTable.tsx`
- `src/features/dashboard/products/ProductsTable.tsx`
- `src/features/merchant/components/WorkspaceStoreSwitcher.tsx`
- `src/features/merchant/stores/StoreListItem.tsx`
- `src/features/merchant/settings/StoreSettingsForm.tsx`
- `src/features/merchant/components/LegacyLayoutRedirector.tsx`
- `src/features/merchant/components/LegacyRouteRedirector.tsx`

---

## Final Recommendation

Start with a 2-week UX stabilization pass focused only on:

- navigation continuity
- setup reassurance
- loading and recovery behavior

After that:

- run task-based merchant testing
- review friction points
- then proceed to orientation and workflow polish

This ordering matters.

If the workspace still feels unstable, adding more features will not solve the core UX problem.
