/**
 * Stripe Connect Types
 * Must match backend response shapes exactly.
 *
 * GET  /api/v1/merchant/stores/{store}/stripe-connect/status  → StripeConnectStatus
 * POST /api/v1/merchant/stores/{store}/stripe-connect/onboard → StripeConnectOnboardResponse
 *
 * NOTE: the backend exposes the same underlying "can this store accept
 * payments" boolean under two DIFFERENT field names depending on the
 * endpoint (`can_receive_payments` on /status, `is_onboarded` on /onboard).
 * This is a known backend API inconsistency, not a typo here — both fields
 * are kept distinct and typed explicitly rather than silently unified so a
 * future backend change to either one doesn't get masked.
 */

export type StripeAccountType = 'express' | 'standard' | 'custom' | null;

/** Raw API shape — GET /stripe-connect/status */
export interface StripeConnectStatus {
  stripe_account_id: string | null;
  stripe_account_type: StripeAccountType;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  onboarded_at: string | null;
  /** Gate for "can this store accept customer payments" — charges_enabled only. */
  can_receive_payments: boolean;
}

/** Raw API shape — POST /stripe-connect/onboard */
export interface StripeConnectOnboardResponse {
  /** Stripe-hosted onboarding URL. Single-use, expires in minutes — never cache it. */
  onboarding_url: string;
  stripe_account_id: string | null;
  /** Same meaning as StripeConnectStatus.can_receive_payments, different field name. */
  is_onboarded: boolean;
}

/** Raw API shape — POST /stripe-connect/dashboard-link */
export interface StripeDashboardLinkResponse {
  /** Stripe Express Dashboard login URL. Single-use, expires quickly — never cache it. */
  url: string;
}
