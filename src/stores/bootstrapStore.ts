'use client';

import { create } from 'zustand';
import type { ApiError } from '@/types/api';
import type {
  BootstrapData,
  LoginPayload,
  OnboardingState,
  ProvisioningState,
  RegisterPayload,
  SessionMetadata,
} from '@/types/auth';
import type { Store, UserStore } from '@/types/store';
import { login as loginRequest, register as registerRequest, logout as logoutRequest, bootstrap as bootstrapRequest, switchStore as switchStoreRequest } from '@/lib/api/auth';
import { resolveProvisioningStoreId } from '@/lib/auth/bootstrap-routing';
import {
  canViewBrandsFromPermissions,
  canViewCategoriesFromPermissions,
  canViewCmsPagesFromPermissions,
  canViewDashboardFromPermissions,
  canViewOrdersFromPermissions,
  canViewProductsFromPermissions,
  canViewTagsFromPermissions,
  canViewUsersFromPermissions,
  hasPermission,
} from '@/lib/auth/permissions';

type UiPermissionKey =
  | 'canManageUsers'
  | 'canManageProducts'
  | 'canManageOrders'
  | 'canViewDashboard'
  | 'canManageCategories'
  | 'canManageBrands'
  | 'canManageTags'
  | 'canManageCmsPages';

export interface BootstrapState {
  bootstrap: BootstrapData | null;
  user: BootstrapData['user'] | null;
  stores: UserStore[];
  activeStore: Store | null;
  onboarding: OnboardingState | null;
  permissions: string[];
  capabilities: unknown[];
  session: SessionMetadata | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  bootstrapResolved: boolean;
  bootstrapError: ApiError | null;
  provisioning: ProvisioningState | null;
}

export interface BootstrapActions {
  setBootstrap: (bootstrap: BootstrapData | null) => void;
  setProvisioning: (updater: Partial<ProvisioningState> | null) => void;
  fetchBootstrap: (options?: { signal?: AbortSignal }) => Promise<BootstrapData | null>;
  login: (payload: LoginPayload) => Promise<BootstrapData | null>;
  register: (payload: RegisterPayload) => Promise<BootstrapData | null>;
  logout: () => Promise<void>;
  switchStore: (storeId: number | string) => Promise<BootstrapData | null>;
  clearSession: () => void;
}

export type BootstrapStore = BootstrapState & BootstrapActions;

const emptyProvisioningState = (): ProvisioningState => ({
  tracked_store_id: null,
  status: null,
  progress: null,
  current_step: null,
  message: null,
  retryable: false,
  started_at: null,
  soft_timed_out: false,
  hard_timed_out: false,
  last_checked_at: null,
});

function createClientBootstrapError(message: string): ApiError {
  return {
    message,
    errors: {},
    status: 500,
    code: 'CLIENT_BOOTSTRAP_PAYLOAD_INVALID',
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBootstrapUserShape(value: unknown): value is BootstrapData['user'] {
  if (!isRecord(value)) {
    console.error('[Bootstrap] User is not a record', value);
    return false;
  }

  // ID can be string or number in some Laravel setups
  if (typeof value.id !== 'number' && typeof value.id !== 'string') {
    console.error('[Bootstrap] user.id is not a number or string', value.id);
    return false;
  }

  if (typeof value.name !== 'string') {
    console.error('[Bootstrap] user.name is not a string', value.name);
    return false;
  }

  if (typeof value.email !== 'string') {
    console.error('[Bootstrap] user.email is not a string', value.email);
    return false;
  }

  // Handle missing is_email_verified by checking email_verified_at
  if (typeof value.is_email_verified !== 'boolean' && value.email_verified_at === undefined) {
    console.error('[Bootstrap] user.is_email_verified is missing and cannot be inferred', value);
    return false;
  }

  // avatar_url vs avatar mismatch
  if (!(typeof value.avatar_url === 'string' || value.avatar_url === null || typeof value.avatar === 'string' || value.avatar === null)) {
    console.error('[Bootstrap] user.avatar_url (or avatar) is invalid', { avatar_url: value.avatar_url, avatar: value.avatar });
    return false;
  }

  if (!(typeof value.email_verified_at === 'string' || value.email_verified_at === null)) {
    console.error('[Bootstrap] user.email_verified_at is not a string or null', value.email_verified_at);
    return false;
  }

  return true;
}

function isBootstrapStoreShape(value: unknown): value is UserStore {
  if (!isRecord(value)) return false;
  
  // ID can be string or number
  const hasValidId = typeof value.id === 'number' || typeof value.id === 'string';
  
  return (
    hasValidId &&
    typeof value.name === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.currency === 'string' &&
    typeof value.role === 'string' &&
    typeof value.status === 'string' &&
    typeof value.is_active === 'boolean' &&
    Array.isArray(value.permissions)
  );
}

function isBootstrapDataShape(value: unknown): value is BootstrapData {
  if (!isRecord(value)) {
    console.error('[Bootstrap] Payload is not a record', value);
    return false;
  }

  if (!isBootstrapUserShape(value.user)) {
    console.error('[Bootstrap] User shape is invalid', value.user);
    return false;
  }

  if (typeof value.email_verified !== 'boolean') {
    console.error('[Bootstrap] email_verified is not a boolean', value.email_verified);
    return false;
  }

  if (!Array.isArray(value.stores)) {
    console.error('[Bootstrap] stores is not an array', value.stores);
    return false;
  }

  if (!value.stores.every(isBootstrapStoreShape)) {
    console.error('[Bootstrap] One or more stores have invalid shape', value.stores);
    return false;
  }

  if (!(value.active_store === null || isBootstrapStoreShape(value.active_store))) {
    console.error('[Bootstrap] active_store shape is invalid', value.active_store);
    return false;
  }

  if (!(typeof value.active_store_id === 'number' || value.active_store_id === 'string' || value.active_store_id === null)) {
    console.error('[Bootstrap] active_store_id is not a number, string or null', value.active_store_id);
    return false;
  }

  if (!isRecord(value.onboarding)) {
    console.error('[Bootstrap] onboarding is not a record', value.onboarding);
    return false;
  }

  if (typeof value.onboarding.step === 'string') {
    // Basic check passed, but let's be more thorough
  } else {
    console.error('[Bootstrap] onboarding.step is not a string', value.onboarding.step);
    return false;
  }

  if (!Array.isArray(value.onboarding.completed_steps)) {
    console.error('[Bootstrap] onboarding.completed_steps is not an array', value.onboarding.completed_steps);
    return false;
  }

  if (typeof value.onboarding.can_resume !== 'boolean') {
    console.error('[Bootstrap] onboarding.can_resume is not a boolean', value.onboarding.can_resume);
    return false;
  }

  if (!(typeof value.onboarding.store_id === 'string' || typeof value.onboarding.store_id === 'number' || value.onboarding.store_id === null)) {
    console.error('[Bootstrap] onboarding.store_id is not a string, number or null', value.onboarding.store_id);
    return false;
  }

  if (typeof value.onboarding.is_completed !== 'boolean') {
    console.error('[Bootstrap] onboarding.is_completed is not a boolean', value.onboarding.is_completed);
    return false;
  }

  if (!Array.isArray(value.permissions)) {
    console.error('[Bootstrap] permissions is not an array', value.permissions);
    return false;
  }

  if (Array.isArray(value.capabilities) || isRecord(value.capabilities)) {
    // Accepted: can be empty array (canonical) or legacy object
  } else {
    console.error('[Bootstrap] capabilities is not an array or record', value.capabilities);
    return false;
  }

  if (!isRecord(value.session)) {
    console.error('[Bootstrap] session is not a record', value.session);
    return false;
  }

  if (typeof value.session.is_current !== 'boolean') {
    console.error('[Bootstrap] session.is_current is not a boolean', value.session.is_current);
    return false;
  }

  if (!isRecord(value.features)) {
    console.error('[Bootstrap] features is not a record', value.features);
    return false;
  }

  if (!isRecord(value.config)) {
    console.error('[Bootstrap] config is not a record', value.config);
    return false;
  }

  if (!Array.isArray(value.config.supported_locales)) {
    console.error('[Bootstrap] config.supported_locales is not an array', value.config.supported_locales);
    return false;
  }

  if (typeof value.config.default_currency !== 'string') {
    console.error('[Bootstrap] config.default_currency is not a string', value.config.default_currency);
    return false;
  }

  if (typeof value.config.timezone !== 'string') {
    console.error('[Bootstrap] config.timezone is not a string', value.config.timezone);
    return false;
  }

  if (!isRecord(value.localization)) {
    console.error('[Bootstrap] localization is not a record', value.localization);
    return false;
  }

  if (!Array.isArray(value.localization.supported_locales)) {
    console.error('[Bootstrap] localization.supported_locales is not an array', value.localization.supported_locales);
    return false;
  }

  if (typeof value.localization.default_currency !== 'string') {
    console.error('[Bootstrap] localization.default_currency is not a string', value.localization.default_currency);
    return false;
  }

  if (typeof value.localization.timezone !== 'string') {
    console.error('[Bootstrap] localization.timezone is not a string', value.localization.timezone);
    return false;
  }

  if (typeof value.actor_context !== 'string') {
    console.error('[Bootstrap] actor_context is not a string', value.actor_context);
    return false;
  }

  return true;
}

function deriveProvisioningState(
  bootstrap: BootstrapData | null,
  previous: ProvisioningState | null
): ProvisioningState | null {
  if (!bootstrap) {
    return null;
  }

  const trackedStoreId = resolveProvisioningStoreId(bootstrap);
  if (!trackedStoreId) {
    return null;
  }

  if (previous?.tracked_store_id === trackedStoreId) {
    return previous;
  }

  return {
    ...emptyProvisioningState(),
    tracked_store_id: trackedStoreId,
    started_at: Date.now(),
  };
}

function applyBootstrapState(
  bootstrapRaw: any,
  previousProvisioning: ProvisioningState | null
): Pick<
  BootstrapState,
  'bootstrap' | 'user' | 'stores' | 'activeStore' | 'onboarding' | 'permissions' | 'capabilities' | 'session' | 'isAuthenticated' | 'isBootstrapping' | 'bootstrapResolved' | 'bootstrapError' | 'provisioning'
> {
  const bootstrap: BootstrapData | null = bootstrapRaw ? {
    ...bootstrapRaw,
    user: {
      ...bootstrapRaw.user,
      id: typeof bootstrapRaw.user.id === 'string' ? Number(bootstrapRaw.user.id) : bootstrapRaw.user.id,
      avatar_url: bootstrapRaw.user.avatar_url ?? bootstrapRaw.user.avatar ?? null,
      is_email_verified: bootstrapRaw.user.is_email_verified ?? Boolean(bootstrapRaw.user.email_verified_at),
    },
    stores: (bootstrapRaw.stores || []).map((s: any) => ({
      ...s,
      id: typeof s.id === 'string' ? Number(s.id) : s.id,
    })),
    active_store: bootstrapRaw.active_store ? {
      ...bootstrapRaw.active_store,
      id: typeof bootstrapRaw.active_store.id === 'string' ? Number(bootstrapRaw.active_store.id) : bootstrapRaw.active_store.id,
    } : null,
    active_store_id: typeof bootstrapRaw.active_store_id === 'string' ? Number(bootstrapRaw.active_store_id) : bootstrapRaw.active_store_id,
    onboarding: {
      ...bootstrapRaw.onboarding,
      step: (() => {
        const isVerified = bootstrapRaw.email_verified || bootstrapRaw.user.is_email_verified || !!bootstrapRaw.user.email_verified_at;
        const currentStep = bootstrapRaw.onboarding.step;
        if (currentStep === 'pending_verification' && isVerified) {
          console.log('[Bootstrap] Healing onboarding step: pending_verification -> create_store');
          return 'create_store';
        }
        return currentStep;
      })(),
      store_id: bootstrapRaw.onboarding.store_id !== null ? String(bootstrapRaw.onboarding.store_id) : null,
    },
    permissions: bootstrapRaw.permissions || [],
    capabilities: Array.isArray(bootstrapRaw.capabilities) ? bootstrapRaw.capabilities : [],
    session: bootstrapRaw.session,
  } : null;

  return {
    bootstrap,
    user: bootstrap?.user ?? null,
    stores: bootstrap?.stores ?? [],
    activeStore: bootstrap?.active_store ?? null,
    onboarding: bootstrap?.onboarding ?? null,
    permissions: bootstrap?.permissions ?? [],
    capabilities: bootstrap?.capabilities ?? [],
    session: bootstrap?.session ?? null,
    isAuthenticated: Boolean(bootstrap?.user),
    isBootstrapping: false,
    bootstrapResolved: true,
    bootstrapError: null,
    provisioning: deriveProvisioningState(bootstrap, previousProvisioning),
  };
}

export const useBootstrapStore = create<BootstrapStore>((set, get) => ({
  bootstrap: null,
  user: null,
  stores: [],
  activeStore: null,
  onboarding: null,
  permissions: [],
  capabilities: [],
  session: null,
  isAuthenticated: false,
  isBootstrapping: true,
  bootstrapResolved: false,
  bootstrapError: null,
  provisioning: null,

  setBootstrap: (bootstrap) =>
    set((state) => applyBootstrapState(bootstrap, state.provisioning)),

  setProvisioning: (updater) =>
    set((state) => {
      if (updater === null) {
        return { provisioning: null };
      }

      const nextProvisioning = {
        ...(state.provisioning ?? emptyProvisioningState()),
        ...updater,
      };

      return { provisioning: nextProvisioning };
    }),

  fetchBootstrap: async (options) => {
    set({ isBootstrapping: true, bootstrapError: null });

    try {
      const response = await bootstrapRequest({ signal: options?.signal });
      if (!isBootstrapDataShape(response.data)) {
        const payloadError = createClientBootstrapError('Bootstrap payload was malformed.');
        set({
          isBootstrapping: false,
          bootstrapResolved: true,
          bootstrapError: payloadError,
        });
        throw payloadError;
      }

      get().setBootstrap(response.data);
      return get().bootstrap;
    } catch (error) {
      const apiError = error as ApiError;

      // Handle standard unauthorized and contamination errors
      const message = apiError.message?.toLowerCase() ?? '';
      const isContaminated = message.includes('session contamination') || message.includes('domain mismatch');

      if (apiError.status === 401 || isContaminated) {
        get().clearSession();
        return null;
      }

      if (options?.signal?.aborted) {
        set({ isBootstrapping: false });
        throw error;
      }

      set({
        isBootstrapping: false,
        bootstrapResolved: true,
        bootstrapError: apiError,
      });
      throw apiError;
    }
  },

  login: async (payload) => {
    await loginRequest(payload);
    return get().fetchBootstrap();
  },

  register: async (payload) => {
    await registerRequest(payload);
    return get().fetchBootstrap();
  },

  logout: async () => {
    try {
      await logoutRequest();
    } finally {
      get().clearSession();
    }
  },

  switchStore: async (storeId) => {
    const response = await switchStoreRequest(storeId);
    const payload = response.data;

    if (isBootstrapDataShape(payload)) {
      get().setBootstrap(payload);
      return get().bootstrap;
    }

    return get().fetchBootstrap();
  },

  clearSession: () =>
    set({
      ...applyBootstrapState(null, null),
      bootstrapResolved: true,
    }),
}));

export const selectBootstrap = (state: BootstrapStore) => state.bootstrap;
export const selectUser = (state: BootstrapStore) => state.user;
export const selectIsAuthenticated = (state: BootstrapStore) => state.isAuthenticated;
export const selectActiveStore = (state: BootstrapStore) => state.activeStore;
export const selectStores = (state: BootstrapStore) => state.stores;
export const selectPermissions = (state: BootstrapStore) => state.permissions;
export const selectOnboarding = (state: BootstrapStore) => state.onboarding;
export const selectIsBootstrapping = (state: BootstrapStore) => state.isBootstrapping;
export const selectBootstrapResolved = (state: BootstrapStore) => state.bootstrapResolved;
export const selectBootstrapError = (state: BootstrapStore) => state.bootstrapError;
export const selectProvisioning = (state: BootstrapStore) => state.provisioning;

export function useHasPermission(permission: string): boolean {
  return useBootstrapStore((state) => hasPermission(state.permissions, permission));
}

export function useCan(permission: UiPermissionKey): boolean {
  return useBootstrapStore((state) => {
    switch (permission) {
      case 'canManageUsers':
        return canViewUsersFromPermissions(state.permissions);
      case 'canManageProducts':
        return canViewProductsFromPermissions(state.permissions);
      case 'canManageOrders':
        return canViewOrdersFromPermissions(state.permissions);
      case 'canManageCategories':
        return canViewCategoriesFromPermissions(state.permissions);
      case 'canManageBrands':
        return canViewBrandsFromPermissions(state.permissions);
      case 'canManageTags':
        return canViewTagsFromPermissions(state.permissions);
      case 'canManageCmsPages':
        return canViewCmsPagesFromPermissions(state.permissions);
      case 'canViewDashboard':
        return canViewDashboardFromPermissions(state.permissions);
      default:
        return false;
    }
  });
}
