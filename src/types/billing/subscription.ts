/**
 * Subscription types for platform billing.
 * Raw API shapes (snake_case from backend) and mapped view shapes.
 */

import type { BillingCycle } from './plan';

/**
 * Subscription status enum matching backend.
 */
export type SubscriptionStatus = 
  | 'incomplete'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'grace_period'
  | 'paused'
  | 'canceled'
  | 'expired';

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

/**
 * Raw API response shape for subscription list item (snake_case).
 */
export interface SubscriptionListItem {
  id: number;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle | null;
  plan: {
    id: number;
    code: string;
    name: string;
  };
  plan_price: {
    amount_cents: number;
    currency: string;
  } | null;
  merchant: {
    billing_account_id: number;
    owner_name: string;
    owner_email: string;
  };
  trial_ends_at: string | null;
  current_period_ends_at: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
}

/**
 * Mapped view shape for subscription list item UI.
 */
export interface SubscriptionListItemView {
  id: number;
  status: SubscriptionStatus;
  billingCycle: BillingCycle | null;
  planName: string;
  planCode: string;
  priceFormatted: string;
  merchantName: string;
  merchantEmail: string;
  currentPeriodEndsAt: string | null;
  currentPeriodEndsAtRelative: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  createdAtRelative: string;
}

/**
 * Raw API response shape for subscription detail (snake_case).
 */
export interface SubscriptionDetail {
  id: number;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle | null;
  provider: string;
  provider_subscription_id: string | null;
  provider_status: string | null;
  provider_synced_at: string | null;
  plan: {
    id: number;
    code: string;
    name: string;
    tier: string;
  } | null;
  pending_plan: {
    id: number;
    code: string;
    name: string;
  } | null;
  pending_plan_effective_at: string | null;
  plan_price: {
    amount_cents: number;
    currency: string;
    billing_cycle: BillingCycle;
  } | null;
  trial_starts_at: string | null;
  trial_ends_at: string | null;
  current_period_starts_at: string | null;
  current_period_ends_at: string | null;
  grace_period_ends_at: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  ended_at: string | null;
  created_at: string;
  merchant: {
    billing_account_id: number;
    owner_id: number;
    owner_name: string;
    owner_email: string;
    legal_name: string | null;
    billing_email: string | null;
    stores: Array<{
      id: number;
      name: string;
      slug: string;
      status: string;
    }>;
  };
  invoices: Array<{
    id: number;
    invoice_number: string;
    status: InvoiceStatus;
    currency: string;
    total_cents: number;
    amount_paid_cents: number;
    amount_due_cents: number;
    issued_at: string | null;
    paid_at: string | null;
    hosted_invoice_url: string | null;
  }>;
  events: Array<{
    id: number;
    event_type: string;
    from_status: string | null;
    to_status: string | null;
    source: string | null;
    reason: string | null;
    actor: string | null;
    created_at: string;
  }>;
}

/**
 * Mapped view shape for subscription detail UI.
 */
export interface SubscriptionDetailView {
  id: number;
  status: SubscriptionStatus;
  billingCycle: BillingCycle | null;
  provider: string;
  providerSubscriptionId: string | null;
  providerStatus: string | null;
  providerSyncedAt: string | null;
  
  plan: {
    id: number;
    code: string;
    name: string;
    tier: string;
  } | null;
  
  pendingPlan: {
    id: number;
    code: string;
    name: string;
  } | null;
  pendingPlanEffectiveAt: string | null;
  pendingPlanEffectiveAtFormatted: string | null;
  
  priceFormatted: string;
  currency: string;
  
  trialStartsAt: string | null;
  trialEndsAt: string | null;
  currentPeriodStartsAt: string | null;
  currentPeriodEndsAt: string | null;
  gracePeriodEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  endedAt: string | null;
  createdAt: string;
  
  merchant: {
    billingAccountId: number;
    ownerId: number;
    ownerName: string;
    ownerEmail: string;
    legalName: string | null;
    billingEmail: string | null;
    stores: Array<{
      id: number;
      name: string;
      slug: string;
      status: string;
    }>;
  };
  
  invoices: Array<{
    id: number;
    invoiceNumber: string;
    status: InvoiceStatus;
    currency: string;
    totalFormatted: string;
    amountPaidFormatted: string;
    amountDueFormatted: string;
    issuedAt: string | null;
    issuedAtFormatted: string | null;
    paidAt: string | null;
    paidAtFormatted: string | null;
    hostedInvoiceUrl: string | null;
  }>;
  
  events: Array<{
    id: number;
    eventType: string;
    fromStatus: string | null;
    toStatus: string | null;
    source: string | null;
    reason: string | null;
    actor: string | null;
    createdAt: string;
    createdAtRelative: string;
  }>;
}

/**
 * Filters for subscription list.
 */
export interface SubscriptionFilters {
  search: string;
  status: 'all' | SubscriptionStatus;
  plan_id: number | null;
  sort: 'created_at' | 'current_period_ends_at' | 'status';
  order: 'asc' | 'desc';
  page: number;
  perPage: number;
}

/**
 * Subscription response from GET /api/v1/billing/subscription
 */
export interface SubscriptionResponse {
  subscription: Subscription | null;
  has_active_subscription: boolean;
  plan_is_current_offering?: boolean;
}

/**
 * Subscription type with plan that includes prices and features
 */
export interface Subscription extends Omit<SubscriptionDetail, 'plan' | 'pending_plan'> {
  plan: {
    id: number;
    code: string;
    name: Record<string, string>;
    tier: string;
    superseded_by_plan_id?: number;
    prices: Array<{
      id: number;
      plan_id: number;
      billing_cycle: BillingCycle;
      currency: string;
      amount_cents: number;
      is_active: boolean;
    }>;
    features: Array<{
      id: number;
      plan_id: number;
      feature_key: string;
      value_type: 'boolean' | 'quota' | 'limit' | 'unlimited';
      limit_value: number | null;
      boolean_value: boolean | null;
    }>;
  } | null;
  pending_plan: {
    id: number;
    code: string;
    name: Record<string, string>;
  } | null;
}

/**
 * Payload for starting a trial
 */
export interface StartTrialPayload {
  plan_id?: number;
  plan_price_id?: number;
  billing_cycle?: BillingCycle;
  success_url: string;
  cancel_url: string;
}

/**
 * Response from trial start (Stripe Checkout Session)
 */
export interface StartTrialResponse {
  url?: string; // Legacy field name
  checkout_url: string;
  session_id: string;
}

/**
 * Payload for upgrading subscription
 */
export interface UpgradeSubscriptionPayload {
  new_plan_id?: number;
  plan_code?: string;
  billing_cycle?: BillingCycle;
  store_id?: number;
  prorate?: boolean;
}

/**
 * Payload for downgrading subscription
 */
export interface DowngradeSubscriptionPayload {
  new_plan_id?: number;
  plan_code?: string;
  billing_cycle?: BillingCycle;
  store_id?: number;
  apply_immediately?: boolean;
}

/**
 * Payload for changing billing cycle
 */
export interface ChangeBillingCyclePayload {
  billing_cycle: BillingCycle;
}
