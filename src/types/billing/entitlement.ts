/**
 * Entitlement Types
 * Must match backend DTOs exactly
 *
 * Raw types  → exact shape returned by Laravel EntitlementResource.
 * View types → mapped shape consumed by UI components.
 */

// ── Raw API types ─────────────────────────────────────────────────────────

export type EntitlementStatus =
  | 'TRIALING'
  | 'ENTITLED'
  | 'READ_ONLY'
  | 'RESTRICTED'
  | 'NONE'
  | 'GRANDFATHERED';

/** Store entitlement snapshot — raw API shape */
export interface StoreEntitlement {
  id: number;
  store_id: number;
  billing_account_id: number;
  subscription_id: number | null;
  plan_id: number | null;
  entitlement_status: EntitlementStatus;
  features: Record<string, boolean | number>;
  limits: Record<string, number> | null;
  expires_at: string | null;
  refreshed_at: string;
  created_at: string;
  updated_at: string;
}

// ── View types ────────────────────────────────────────────────────────────

/** Store entitlement — mapped for UI consumption */
export interface StoreEntitlementView {
  id: number;
  storeId: number;
  billingAccountId: number;
  subscriptionId: number | null;
  planId: number | null;
  entitlementStatus: EntitlementStatus;
  features: Record<string, boolean | number>;
  limits: Record<string, number> | null;
  expiresAt: string | null;
  refreshedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ── Utility types ─────────────────────────────────────────────────────────

/** Result of an entitlement check */
export interface EntitlementCheck {
  allowed: boolean;
  reason?: string;
  current?: number;
  limit?: number;
}
