import type { ProvisioningStatus, UserStore, Store } from '@/types/store';

export type OnboardingStep =
  | 'pending_verification'
  | 'create_store'
  | 'store_creation_in_progress'
  | 'store_created'
  | 'store_configured'
  | 'completed';

/**
 * Transport response user shape for login/register responses.
 */
export interface AuthTransportUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  email_verified_at: string | null;
  onboarding_step: OnboardingStep;
  has_password: boolean;
  has_google_linked: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Canonical bootstrap user shape returned from GET /api/v1/merchant/me.
 */
export interface BootstrapUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  is_email_verified: boolean;
  email_verified_at: string | null;
}

export type User = BootstrapUser | AuthTransportUser;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface SessionMetadata {
  id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  last_active_at: string | null;
  is_current: boolean;
  auth_domain: string | null;
  actor_type: string | null;
  route_domain: string | null;
  onboarding_applicable: boolean;
  future_guard_hint: string | null;
}

export interface LocalizationConfig {
  supported_locales: string[];
  default_currency: string;
  timezone: string;
}

export interface OnboardingState {
  step: OnboardingStep;
  completed_steps: string[];
  can_resume: boolean;
  store_id: string | null;
  is_completed: boolean;
}

export interface BootstrapData {
  user: BootstrapUser;
  email_verified: boolean;
  stores: UserStore[];
  active_store: Store | null;
  active_store_id: number | null;
  onboarding: OnboardingState;
  permissions: string[];
  capabilities: unknown[];
  session: SessionMetadata;
  features: Record<string, boolean>;
  config: LocalizationConfig;
  localization: LocalizationConfig;
  actor_context: 'merchant' | 'super_admin' | string;
}

export interface BootstrapSnapshot {
  bootstrap: BootstrapData | null;
  provisioning: ProvisioningState | null;
}

export interface ProvisioningState {
  tracked_store_id: number | null;
  tracked_store_slug: string | null;
  status: ProvisioningStatus['status'] | null;
  progress: number | null;
  current_step: string | null;
  message: string | null;
  retryable: boolean;
  started_at: number | null;
  soft_timed_out: boolean;
  hard_timed_out: boolean;
  last_checked_at: number | null;
}

export interface LoginResponse {
  user: AuthTransportUser;
}

export type RegisterResponse = AuthTransportUser;

export type SwitchStoreResponse = BootstrapData | { active_store_id: number | null };

export interface AuthState {
  user: BootstrapUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
