/**
 * Plan & Pricing Types
 * Must match backend DTOs exactly
 *
 * Raw types  → exact shape returned by Laravel BillingPlanResource.
 * View types → mapped shape consumed by UI components.
 */

// ── Raw API types ─────────────────────────────────────────────────────────

export type BillingCycle = 'monthly' | 'annual';
export type PlanTier = 'starter' | 'growth' | 'enterprise' | 'free';
export type FeatureType = 'boolean' | 'quota' | 'limit' | 'unlimited';

/** Plan list item — raw API shape */
export interface Plan {
  id: number;
  code: string;
  name: Record<string, string>; // {"en": "Starter", "ar": "المبتدئ"}
  description: Record<string, string> | null;
  tier: PlanTier;
  is_public: boolean;
  is_active: boolean;
  trial_days: number;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  prices: PlanPrice[];
  features: PlanFeature[];
}

/** Plan price — raw API shape */
export interface PlanPrice {
  id: number;
  plan_id: number;
  billing_cycle: BillingCycle;
  currency: string;
  amount_cents: number;
  provider: string;
  provider_price_id: string | null;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/** Plan feature — raw API shape */
export interface PlanFeature {
  id: number;
  plan_id: number;
  feature_key: string;
  value_type: FeatureType;
  limit_value: number | null;
  boolean_value: boolean | null;
  created_at: string;
  updated_at: string;
}

// ── View types ────────────────────────────────────────────────────────────

/** Plan list item — mapped for UI consumption */
export interface PlanView {
  id: number;
  code: string;
  name: Record<string, string>;
  description: Record<string, string> | null;
  tier: PlanTier;
  isPublic: boolean;
  isActive: boolean;
  trialDays: number;
  sortOrder: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  prices: PlanPriceView[];
  features: PlanFeatureView[];
}

/** Plan price — mapped for UI consumption */
export interface PlanPriceView {
  id: number;
  planId: number;
  billingCycle: BillingCycle;
  currency: string;
  amountCents: number;
  provider: string;
  providerPriceId: string | null;
  isActive: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

/** Plan feature — mapped for UI consumption */
export interface PlanFeatureView {
  id: number;
  planId: number;
  featureKey: string;
  valueType: FeatureType;
  limitValue: number | null;
  booleanValue: boolean | null;
  createdAt: string;
  updatedAt: string;
}
