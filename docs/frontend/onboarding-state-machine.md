# Onboarding State Machine

## States

The setup flow has four primary states, driven by `bootstrap.onboarding.step`:

| State                  | Trigger condition                                                    | UI rendered         |
|------------------------|----------------------------------------------------------------------|---------------------|
| `pending_verification` | `onboarding.step === 'pending_verification'` and email not verified  | `VerifyEmailStep`   |
| `create_store`         | `onboarding.step === 'create_store'`                                 | `CreateStoreStep`   |
| `provisioning`         | `needsProvisioningFlow(bootstrap, provisioning) === true`            | `ProvisioningStep`  |
| `completed`            | Active store is ready (`status === 'active' && is_active === true`)  | Redirect to dashboard |

---

## Healing Logic

If `onboarding.step === 'pending_verification'` but the user's email is verified, the orchestrator advances the effective step to `create_store` without waiting for a backend step update.

This is implemented in both:
- `bootstrapStore.ts` (`applyBootstrapState`)
- `SetupOrchestrator.tsx` (local healing guard)

---

## Provisioning Flow

`needsProvisioningFlow()` returns `true` when any of the following are true:

1. `onboarding.step` is one of: `store_creation_in_progress`, `store_created`, `store_configured`
2. `active_store` exists but is not `active` or `is_active`
3. `provisioning.tracked_store_id` is set and polling is not yet `completed`/`failed`/hard-timed-out

---

## Provisioning Lifecycle Steps (Frontend)

The `ProvisioningStep` component maps backend `current_step` values to a visual checklist:

| Backend `current_step`      | Display label                  |
|-----------------------------|--------------------------------|
| `initializing_store`        | Creating store                 |
| `provisioning_workspace`    | Provisioning workspace         |
| `applying_configuration`    | Applying starter configuration |
| `finalizing_setup`          | Finalizing setup               |

Steps before the current one are shown as completed (✓). The current step shows a spinner. Future steps are shown as pending.

---

## Polling Behavior

Managed by `useProvisioningStatus` hook:

| Elapsed time     | Poll interval |
|------------------|---------------|
| 0 – 60s          | 2 seconds     |
| 60s – 5min       | 5 seconds     |
| 5min – 10min     | 10 seconds    |
| > 10min          | Stopped (hard timeout) |

Polling pauses when:
- Tab is not visible (`document.visibilityState !== 'visible'`)
- Browser is offline

Polling resumes automatically when visibility or connectivity is restored.

---

## Timeout Behavior

| Timeout type | Threshold | Behavior                                      |
|--------------|-----------|-----------------------------------------------|
| Soft timeout | 2 minutes | Warning shown, polling continues              |
| Hard timeout | 10 minutes| Polling stops, manual retry required          |
| Stalled pending | 90s after start + bootstrap confirms store exists | Treated as failed |

---

## Recovery Behavior

After any failure or timeout, the user is shown recovery guidance with two actions:
- **Check again** — retries the provisioning status poll
- **Refresh bootstrap** — invalidates the bootstrap query to re-fetch server state

The setup page is refresh-safe: on reload, bootstrap restores the correct step automatically.

---

## Redirect on Completion

When `provisioning.status === 'completed'` and `bootstrap.active_store` is ready:

1. `ProvisioningStep` triggers a bootstrap refresh
2. Once `active_store.status === 'active'`, redirects to `ROUTES.store(storeId).dashboard()`

This redirect is handled entirely within `ProvisioningStep` — no external routing logic required.
