# Merchant UX Manual Chromium Scenarios

## Purpose

Use this checklist to manually verify the completed merchant UX rollout in Chromium.

Environment:

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:8000`

Recommended browser:

- Chromium
- DevTools open for console and network inspection

Suggested verification order:

1. P0 navigation and loading
2. P0 setup flow
3. P1 shell trust and store management
4. P1 orientation and empty states
5. P2 post-onboarding and workflow comfort

---

## Preconditions

Before testing:

- frontend is running on `http://localhost:3001`
- backend is running on `http://localhost:8000`
- test accounts are available for:
  - merchant with at least one active store
  - merchant with multiple stores
  - merchant with no store yet
- if possible, also have:
  - a blocked or disabled store state
  - a provisioning or failed provisioning state

If local seeded accounts are unknown, use the same accounts already used by your Playwright flows or backend seed data.

---

## Scenario 1: Login Redirect and Merchant Entry

### Goal

Verify merchants enter the canonical workspace cleanly.

### Steps

1. Open Chromium.
2. Go to `http://localhost:3001/en/login`.
3. Log in as a merchant with a ready active store.
4. Observe the redirect after login.

### Expected

- login completes without a broken state
- user lands in `/en/merchant/dashboard`
- the shell is visible
- there is no distracting full-screen redirect loop
- active store context is visible

### Watch For

- repeated redirects
- landing in `/stores/[id]/*` first
- blank full-screen loading state that lasts too long
- console errors

---

## Scenario 2: Canonical Navigation Across Merchant Workspace

### Goal

Verify main merchant navigation stays in `/merchant/*`.

### Steps

1. From dashboard, open:
   - Products
   - Orders
   - Categories
   - Stores
   - Settings
2. Open one create or edit page if data exists.
3. Use browser back/forward.

### Expected

- URLs remain under `/en/merchant/*`
- navigation feels direct
- browser history works naturally
- shell stays visible throughout

### Watch For

- visible legacy redirect adapters
- route bouncing through `/stores/[id]/*`
- shell disappearing unexpectedly

---

## Scenario 3: Direct Legacy Route Fallback

### Goal

Verify legacy routes still work as compatibility fallback.

### Steps

1. While logged in as a merchant, manually enter:
   - `http://localhost:3001/en/stores/101/products`
   - `http://localhost:3001/en/stores/101/dashboard`
2. Repeat with another valid store id if available.

### Expected

- app redirects or repairs the route into `/en/merchant/*`
- shell stays visible or returns quickly
- messaging is compact and calm if shown
- no dead end or hard failure

### Watch For

- broken route
- spinner loop
- shell loss
- wrong active store context after redirect

---

## Scenario 4: Store Switch Preserves Route Context

### Goal

Verify switching store does not throw the merchant out of the current workspace page.

### Steps

1. Log in as a merchant with at least two stores.
2. Open `Products`.
3. Open the store switcher.
4. Switch to another active store.

### Expected

- URL remains on `/en/merchant/products`
- shell remains visible
- store switch feedback is clear
- current store label updates
- permissions and data refresh appropriately

### Watch For

- full-screen reload
- being kicked back to dashboard unexpectedly
- stale data from prior store
- unclear disabled-store messaging

---

## Scenario 5: Disabled / Blocked / Provisioning Store Messaging

### Goal

Verify non-ready stores are clearly explained.

### Steps

1. Open the workspace store switcher.
2. Inspect disabled, archived, suspended, or provisioning stores if available.
3. Visit the Stores page and inspect store cards.

### Expected

- each non-ready status is understandable
- merchants can tell why a store is unavailable
- store cards and switcher messaging feel human and actionable

### Watch For

- terse unexplained status labels
- clickable but broken disabled options
- support-only dead ends with no guidance

---

## Scenario 6: Setup Flow for Merchant With No Store

### Goal

Verify the new setup framing feels guided and calm.

### Steps

1. Log in as a merchant with no store.
2. Go to `http://localhost:3001/en/setup`.
3. Walk through:
   - verify email step
   - create store step
   - provisioning step
4. Observe completion handoff.

### Expected

- setup language feels reassuring
- progress is visible and understandable
- there is no stressful or overly technical copy
- provisioning gives calm status updates
- completion ends on a useful setup-complete handoff instead of an abrupt redirect

### Watch For

- old debug/provisioning text
- references to bootstrap internals
- abrupt dashboard jump
- broken action cards after completion

---

## Scenario 7: Setup Recovery State

### Goal

Verify provisioning failure or delay is handled gracefully.

### Steps

1. Use a merchant or environment state that simulates failed or delayed provisioning.
2. Enter the provisioning step.
3. Trigger the retry or recovery path if available.

### Expected

- heading and copy remain calm
- help text is understandable
- retry path is present when appropriate
- no technical debugging text is shown to merchants

### Watch For

- "Recovery guidance" old copy
- raw timestamps or tracking ids
- technical wording like bootstrap refresh

---

## Scenario 8: Setup Completion Handoff

### Goal

Verify the new post-setup action surface works.

### Steps

1. Reach the completed setup state.
2. Confirm the success message shows store name.
3. Test:
   - Add your first product
   - Customize your storefront
   - Go to dashboard
   - Explore your store settings

### Expected

- each action navigates correctly
- the handoff feels intentional and useful
- no broken or placeholder actions exist

### Watch For

- missing route targets
- blank pages
- old auto-redirect behavior returning unexpectedly

---

## Scenario 9: Top Bar Trust Check

### Goal

Verify the top bar contains only useful controls.

### Steps

1. Visit several merchant pages.
2. Inspect the top bar on desktop width.
3. Check:
   - no fake search field
   - no misleading disabled notification UI
   - controls that remain are useful

### Expected

- the top bar feels credible
- no obviously fake placeholder controls remain

### Watch For

- dead controls
- empty buttons
- disabled placeholder elements pretending to be features

---

## Scenario 10: Page Header and Orientation Check

### Goal

Verify updated merchant pages provide context and direction.

### Steps

1. Visit:
   - Dashboard
   - Products
   - Categories
   - Orders
   - Stores
   - Settings
2. Inspect the page header on each.

### Expected

- page title is clear
- short supporting text explains purpose
- current store context is visible where relevant
- deeper pages are not disorienting

### Watch For

- pages that still feel cold or contextless
- inconsistent header patterns
- missing active store context on pages that need it

---

## Scenario 11: Empty State Guidance

### Goal

Verify empty states explain what to do next.

### Steps

1. Visit pages with no data if possible:
   - products
   - categories
   - orders
   - stores
2. Inspect the empty-state content.

### Expected

- empty state explains why the page is empty
- there is one strong next action
- the merchant does not feel blocked or lost

### Watch For

- generic "empty" text with no direction
- multiple competing actions
- missing CTA

---

## Scenario 12: Store Settings Self-Service

### Goal

Verify store settings feel clearer and more self-serve.

### Steps

1. Open a store settings page.
2. Inspect editable fields.
3. Change a safe field like store name.
4. Save.
5. Inspect slug-related messaging.

### Expected

- save feedback is clear
- form feels self-serve
- slug handling is understandable
- no abrupt support dead end without explanation

### Watch For

- silent save
- vague error messages
- confusing slug language

---

## Scenario 13: First-Run Merchant Checklist

### Goal

Verify post-onboarding guidance appears when appropriate.

### Steps

1. Use a merchant who should still qualify as new.
2. Open the merchant dashboard after setup completion.
3. Inspect any checklist or onboarding guidance.

### Expected

- checklist appears only for the right merchants
- tasks are actionable
- checklist is lightweight and not intrusive

### Watch For

- checklist showing for established merchants
- broken task links
- visually heavy takeover UI

---

## Scenario 14: Workflow Comfort Improvements

### Goal

Verify any implemented workflow-comfort features behave correctly.

### Steps

1. Visit the pages touched by P2 workflow improvements.
2. Exercise the specific features that were shipped:
   - draft restore
   - safer unsaved changes handling
   - saved filters
   - bulk actions

### Expected

- improvements reduce repeated effort
- no regression to normal workflow
- user feedback is understandable

### Watch For

- inconsistent prompts
- accidental data loss
- actions without clear confirmation

---

## Scenario 15: Browser History and Multi-Step Navigation

### Goal

Verify that the merchant workspace remains stable under realistic navigation.

### Steps

1. Navigate through several pages.
2. Use back and forward.
3. Switch stores.
4. Open settings.
5. Return to dashboard.

### Expected

- history navigation behaves predictably
- route context remains canonical
- store context stays consistent

### Watch For

- history loops
- unexpected setup redirects
- stale store context

---

## Quick Runtime Checks

While testing in Chromium, also check:

- DevTools console for runtime errors
- failed network requests in the Network tab
- repeated redirects
- hydration warnings
- broken buttons or links

---

## Known Verification Notes

- The setup completion flow now intentionally ends on a completion handoff instead of immediately auto-redirecting to `/merchant/dashboard`.
- Legacy `/stores/[id]/*` routes are compatibility fallbacks and should resolve back into canonical `/merchant/*` flows.
- If automated onboarding tests fail expecting a direct dashboard redirect, they are likely asserting the old behavior rather than a real regression.
