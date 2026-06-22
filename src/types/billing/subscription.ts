/**
 * Subscription Types
 * Must match backend DTOs exactly
 *
 * Raw types  → exact shape returned by Laravel SubscriptionResource.
 * View types → mapped shape consumed by UI components.
 */

import type { BillingCycle, Plan } from './plan';

// ── Raw API types ─────────────────────────────────────────────────────────

export type SubscriptionStatus =
  | 'incomplete'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'grace_period'
  | 'paused'
  | 'canceled'
  | 'expired';

/** Subscription — raw API shape */
export interface Subscription {
  id: number;
  billing_account_id: number;
  plan_id: number;
  plan_price_id: number | null;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;
  provider: string;
  provider_subscription_id: string | null;
  provider_status: string | null;
  provider_synced_at: string | null;
  trial_starts_at: string | null;
  trial_ends_at: string | null;
  current_period_starts_at: string | null;
  current_period_ends_at: string | null;
  grace_period_ends_at: string | null;
  canceled_at: string | null;
  cancel_at_period_end: boolean;
  collection_paused: boolean;
  ended_at: string | null;
  pending_plan_id: number | null;
  pending_plan_effective_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  plan?: Plan;
  pending_plan?: Plan;
}

// ── View types ────────────────────────────────────────────────────────────

/** Subscription — mapped for UI consumption */
export interface SubscriptionView {
  id: number;
  billingAccountId: number;
  planId: number;
  planPriceId: number | null;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  provider: string;
  providerSubscriptionId: string | null;
  providerStatus: string | null;
  providerSyncedAt: string | null;
  trialStartsAt: string | null;
  trialEndsAt: string | null;
  currentPeriodStartsAt: string | null;
  currentPeriodEndsAt: string | null;
  gracePeriodEndsAt: string | null;
  canceledAt: string | null;
  cancelAtPeriodEnd: boolean;
  collectionPaused: boolean;
  endedAt: string | null;
  pendingPlanId: number | null;
  pendingPlanEffectiveAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  plan?: Plan;
  pendingPlan?: Plan;
}

// ── Form/Payload types ────────────────────────────────────────────────────

/** Payload for checkout session */
export interface StartTrialPayload {
  plan_price_id: number;
  success_url: string;
  cancel_url: string;
}

/** Response from checkout session creation */
export interface StartTrialResponse {
  url: string;
  session_id: string;
}

/** Payload for POST /billing/subscription/upgrade */
export interface UpgradeSubscriptionPayload {
  plan_code: string;
  billing_cycle: BillingCycle;
  store_id: number;
  prorate?: boolean;
}

/** Payload for POST /billing/subscription/downgrade */
export interface DowngradeSubscriptionPayload {
  plan_code: string;
  billing_cycle: BillingCycle;
  store_id: number;
  apply_immediately?: boolean;
}

/** Payload for POST /billing/subscription/change-cycle */
export interface ChangeBillingCyclePayload {
  billing_cycle: BillingCycle;
}
