# Setup Flow Architecture

## Overview

The merchant setup experience is a single-route, state-driven flow located at `/setup`.

It replaces the previous fragmented `/onboarding` + `/create-store` two-page pattern with a unified orchestration model. The merchant never navigates between pages during setup — the UI transitions between steps internally based on bootstrap state.

---

## Canonical Route

```
/setup
```

Legacy routes redirect here permanently:

| Legacy route    | Redirects to |
|-----------------|--------------|
| `/onboarding`   | `/setup`     |
| `/create-store` | `/setup`     |

---

## Component Structure

```
SetupOrchestrator          ← state machine, reads bootstrap
├── VerifyEmailStep        ← pending_verification state
├── CreateStoreStep        ← create_store state
├── ProvisioningStep       ← provisioning state (polling, lifecycle UI)
└── (fallback recovery)    ← unrecognised state
```

All components live under `src/features/setup/components/`.

---

## State Machine

The orchestrator reads `bootstrap.onboarding.step` and `provisioning` state to determine which step to render:

```
bootstrap not resolved  →  Loading / recovery screen
pending_verification    →  VerifyEmailStep
create_store            →  CreateStoreStep
provisioning in progress→  ProvisioningStep
completed               →  Redirect to dashboard (handled by ProvisioningStep)
```

See `docs/frontend/onboarding-state-machine.md` for the full state diagram.

---

## Bootstrap Ownership

Bootstrap is the single source of truth. The setup flow never manages its own routing state — it reads from `useBootstrapStore` and reacts to changes.

- `bootstrap.onboarding.step` drives which step renders
- `bootstrap.provisioning` drives the provisioning polling lifecycle
- `resolveBootstrapAccessState()` in `src/lib/auth/bootstrap-routing.ts` is the canonical resolver

---

## API Integration

| Action              | Endpoint                                                   | Called from         |
|---------------------|------------------------------------------------------------|---------------------|
| Slug availability   | `GET /api/v1/merchant/store-slug/check?slug=`              | `CreateStoreStep`   |
| Create store        | `POST /api/v1/merchant/stores`                             | `CreateStoreStep`   |
| Provisioning status | `GET /api/v1/merchant/stores/{store}/provisioning-status`  | `useProvisioningStatus` |

All endpoints are accessed via `src/lib/api/stores.ts` using `API_ROUTES.merchant.stores.*`.

---

## Future Extensibility

The `SetupOrchestrator` is designed to accept additional steps without architectural changes. To add a new step:

1. Add a new state value to the state machine switch
2. Create a new step component under `src/features/setup/components/`
3. Add the render branch to `SetupOrchestrator`

Planned future steps:
- Billing setup
- Theme selection
- Domain configuration
- Payment setup
- First product wizard
- Tax configuration
