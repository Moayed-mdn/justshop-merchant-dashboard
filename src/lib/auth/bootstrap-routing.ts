import { ROUTES } from '@/config/routes';
import type { BootstrapData, OnboardingStep, ProvisioningState } from '@/types/auth';
import type { Store } from '@/types/store';

const PROVISIONING_ONBOARDING_STEPS: OnboardingStep[] = [
  'store_creation_in_progress',
  'store_created',
  'store_configured',
];

const BLOCKED_STORE_STATUSES = new Set(['disabled', 'suspended', 'archived', 'deleted_pending']);

export type BootstrapAccessKind =
  | 'guest'
  | 'pending_verification'
  | 'create_store'
  | 'provisioning'
  | 'blocked'
  | 'ready'
  | 'no_store';

export interface BootstrapAccessState {
  kind: BootstrapAccessKind;
  redirectPath: string;
  activeStoreId: string | null;
}

export function isBootstrapStoreReady(store: Store | null): boolean {
  return Boolean(store && store.status === 'active' && store.is_active);
}

export function isBootstrapStoreBlocked(store: Store | null): boolean {
  return Boolean(store && BLOCKED_STORE_STATUSES.has(store.status));
}

export function resolveProvisioningStoreId(bootstrap: BootstrapData | null): number | null {
  if (!bootstrap) {
    return null;
  }

  const onboardingStoreId = bootstrap.onboarding.store_id;
  if (onboardingStoreId) {
    const parsedStoreId = Number(onboardingStoreId);
    return Number.isNaN(parsedStoreId) ? null : parsedStoreId;
  }

  if (bootstrap.active_store && !isBootstrapStoreReady(bootstrap.active_store)) {
    return bootstrap.active_store.id;
  }

  const pendingStore = bootstrap.stores.find((store) => !isBootstrapStoreReady(store) && !isBootstrapStoreBlocked(store));
  if (pendingStore) {
    return pendingStore.id;
  }

  return null;
}

export function needsProvisioningFlow(
  bootstrap: BootstrapData | null,
  provisioning: ProvisioningState | null = null
): boolean {
  if (!bootstrap) {
    return false;
  }

  // If the active store is already ready, provisioning is complete — no flow needed.
  // This short-circuits all tracking logic below and prevents spurious redirects to /setup
  // when onboarding.store_id is still set on the bootstrap payload after a store is active.
  if (bootstrap.active_store && isBootstrapStoreReady(bootstrap.active_store)) {
    return false;
  }

  // 1. Explicit backend steps always win
  if (PROVISIONING_ONBOARDING_STEPS.includes(bootstrap.onboarding.step)) {
    return true;
  }

  // 2. If we have an active store that isn't ready/blocked, we stay in provisioning flow
  if (
    bootstrap.active_store &&
    !isBootstrapStoreReady(bootstrap.active_store) &&
    !isBootstrapStoreBlocked(bootstrap.active_store)
  ) {
    return true;
  }

  // 3. If we are tracking a store ID, we stay in provisioning KIND until:
  //    a) The polling says it's completed AND bootstrap data confirms we have a ready store
  //    b) OR it's failed/timed out, in which case we stay in the flow to show error/retry
  if (provisioning?.tracked_store_id) {
    // If polling is "completed", but bootstrap hasn't "caught up" yet (active_store is missing or not ready),
    // we stay in the provisioning KIND to prevent a redirect loop between /onboarding and /dashboard.
    if (provisioning.status === 'completed') {
      const hasReadyStore = bootstrap.active_store && isBootstrapStoreReady(bootstrap.active_store);
      if (!hasReadyStore) {
        return true;
      }
      return false; // Actually ready
    }

    // For any other status (running, pending, failed, soft/hard timeout), we stay in the provisioning flow.
    // This ensures ProvisioningStep can render its own error/retry states.
    return true;
  }

  return false;
}

export function resolvePostBootstrapPath(
  bootstrap: BootstrapData | null,
  provisioning: ProvisioningState | null = null
): string {
  return resolveBootstrapAccessState(bootstrap, provisioning).redirectPath;
}

export function resolveBootstrapAccessState(
  bootstrap: BootstrapData | null,
  provisioning: ProvisioningState | null = null
): BootstrapAccessState {
  if (!bootstrap) {
    return {
      kind: 'guest',
      redirectPath: ROUTES.auth.login(),
      activeStoreId: null,
    };
  }

  // Healing logic: if email is verified but step is stuck in pending_verification
  const isVerified = bootstrap.email_verified || bootstrap.user.is_email_verified;
  const step = (bootstrap.onboarding.step === 'pending_verification' && isVerified)
    ? 'create_store'
    : bootstrap.onboarding.step;

  if (step === 'pending_verification') {
    return {
      kind: 'pending_verification',
      redirectPath: ROUTES.setup(),
      activeStoreId: null,
    };
  }

  if (step === 'create_store') {
    return {
      kind: 'create_store',
      redirectPath: ROUTES.setup(),
      activeStoreId: null,
    };
  }

  if (needsProvisioningFlow(bootstrap, provisioning)) {
    const provisioningStoreId = resolveProvisioningStoreId(bootstrap);
    return {
      kind: 'provisioning',
      redirectPath: ROUTES.setup(),
      activeStoreId: provisioningStoreId ? String(provisioningStoreId) : null,
    };
  }

  if (bootstrap.active_store && isBootstrapStoreBlocked(bootstrap.active_store)) {
    return {
      kind: 'blocked',
      redirectPath: ROUTES.dashboard.home(),
      activeStoreId: String(bootstrap.active_store.id),
    };
  }

  if (bootstrap.active_store && isBootstrapStoreReady(bootstrap.active_store)) {
    return {
      kind: 'ready',
      redirectPath: ROUTES.merchant.dashboard(),
      activeStoreId: String(bootstrap.active_store.id),
    };
  }

  return {
    kind: 'no_store',
    redirectPath: ROUTES.dashboard.home(),
    activeStoreId: null,
  };
}

export function normalizeBackendRedirectPath(redirectPath: string | undefined): string | null {
  if (!redirectPath || !redirectPath.startsWith('/')) {
    return null;
  }

  if (redirectPath === '/dashboard') {
    return ROUTES.dashboard.home();
  }

  return redirectPath;
}
