/**
 * Billing API functions (client-side).
 * All calls go through clientApi → /api/proxy → Laravel.
 * 
 * Integrates with all 14 backend billing endpoints.
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Plan } from '@/types/billing/plan';
import type {
  Subscription,
  StartTrialPayload,
  StartTrialResponse,
  UpgradeSubscriptionPayload,
  DowngradeSubscriptionPayload,
  ChangeBillingCyclePayload,
} from '@/types/billing/subscription';
import type { Invoice, InvoiceFilters } from '@/types/billing/invoice';
import type { StoreEntitlement, EntitlementStatus } from '@/types/billing/entitlement';

const BILLING_BASE = '/api/v1/merchant/billing';
const PUBLIC_BASE = '/api/v1/merchant/public';

// ==================== Plans ====================

/**
 * Fetch all available subscription plans.
 * GET /api/v1/merchant/public/plans
 */
export async function getPlans(): Promise<Plan[]> {
  const response = await clientApi.get<ApiResponse<{ plans: Plan[]; currency: string }>>(
    `${PUBLIC_BASE}/plans`
  );
  return response.data.plans;
}

// ==================== Trial ====================

/**
 * Create a Stripe Checkout Session for subscription signup.
 * POST /api/v1/merchant/billing/checkout
 */
export async function startTrial(
  payload: StartTrialPayload
): Promise<StartTrialResponse> {
  const response = await clientApi.post<ApiResponse<StartTrialResponse>>(
    `${BILLING_BASE}/checkout`,
    payload
  );
  return response.data;
}

// ==================== Subscription ====================

/**
 * Get current subscription for the authenticated account.
 * GET /api/v1/billing/subscription
 */
interface SubscriptionResponse {
  subscription: Subscription | null;
  has_active_subscription: boolean;
}

export async function getSubscription(): Promise<Subscription | null> {
  try {
    const response = await clientApi.get<ApiResponse<SubscriptionResponse>>(
      `${BILLING_BASE}/subscription`
    );
    return response.data.subscription;
  } catch (error) {
    if ((error as { status?: number }).status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Upgrade to a higher-tier plan (immediate, prorated).
 * POST /api/v1/billing/subscription/upgrade
 */
export async function upgradeSubscription(
  payload: UpgradeSubscriptionPayload
): Promise<Subscription> {
  const response = await clientApi.post<ApiResponse<Subscription>>(
    `${BILLING_BASE}/subscription/upgrade`,
    payload
  );
  return response.data;
}

/**
 * Downgrade to a lower-tier plan (scheduled at period end).
 * POST /api/v1/billing/subscription/downgrade
 */
export async function downgradeSubscription(
  payload: DowngradeSubscriptionPayload
): Promise<Subscription> {
  const response = await clientApi.post<ApiResponse<Subscription>>(
    `${BILLING_BASE}/subscription/downgrade`,
    payload
  );
  return response.data;
}

/**
 * Change billing cycle (monthly ↔ annual).
 * POST /api/v1/billing/subscription/change-cycle
 */
export async function changeBillingCycle(
  payload: ChangeBillingCyclePayload
): Promise<Subscription> {
  const response = await clientApi.post<ApiResponse<Subscription>>(
    `${BILLING_BASE}/subscription/change-cycle`,
    payload
  );
  return response.data;
}

/**
 * Cancel subscription (at period end).
 * POST /api/v1/billing/subscription/cancel
 */
export async function cancelSubscription(): Promise<Subscription> {
  const response = await clientApi.post<ApiResponse<Subscription>>(
    `${BILLING_BASE}/subscription/cancel`
  );
  return response.data;
}

/**
 * Resume a canceled subscription (before period end).
 * POST /api/v1/billing/subscription/resume
 */
export async function resumeSubscription(): Promise<Subscription> {
  const response = await clientApi.post<ApiResponse<Subscription>>(
    `${BILLING_BASE}/subscription/resume`
  );
  return response.data;
}

// ==================== Invoices ====================

/**
 * List all invoices with optional filters.
 * GET /api/v1/billing/invoices
 */
export async function getInvoices(
  filters?: InvoiceFilters
): Promise<PaginatedResponse<Invoice>> {
  const params: Record<string, string | number | boolean | undefined> = {};
  
  if (filters?.status) params.status = filters.status;
  if (filters?.year) params.year = filters.year;
  if (filters?.page) params.page = filters.page;
  if (filters?.per_page) params.per_page = filters.per_page;
  
  return clientApi.get<PaginatedResponse<Invoice>>(
    `${BILLING_BASE}/invoices`,
    { params }
  );
}

/**
 * Get single invoice with line items.
 * GET /api/v1/billing/invoices/{id}
 */
export async function getInvoice(id: number): Promise<Invoice> {
  const response = await clientApi.get<ApiResponse<Invoice>>(
    `${BILLING_BASE}/invoices/${id}`
  );
  return response.data;
}

// ==================== Billing Portal ====================

/**
 * Create Stripe Billing Portal session (returns redirect URL).
 * POST /api/v1/billing/portal/session
 */
export async function createPortalSession(
  returnUrl: string
): Promise<{ url: string }> {
  const response = await clientApi.post<ApiResponse<{ url: string }>>(
    `${BILLING_BASE}/portal`,
    { return_url: returnUrl }
  );
  return response.data;
}

// ==================== Entitlements ====================

/**
 * Get account-level entitlement data for current organization.
 * GET /api/v1/merchant/billing/subscription/usage
 * 
 * This returns features, limits, and usage for the billing account,
 * not for a specific store.
 */
export async function getEntitlements(): Promise<StoreEntitlement> {
  try {
    const response = await clientApi.get<ApiResponse<{ usage: {
      stores: { count: number; limit: number };
      products: { count: number; limit: number };
    } }>>(
      `${BILLING_BASE}/subscription/usage`
    );
    
    // Transform the response to match StoreEntitlement structure
    const usage = response.data.usage;
    
    return {
      id: 0,
      store_id: 0,
      billing_account_id: 0,
      subscription_id: null,
      plan_id: null,
      entitlement_status: 'TRIALING' as EntitlementStatus,
      features: {
        'stores.max': usage.stores.limit,
        'products.max': usage.products.limit,
      },
      limits: {
        'stores.count': usage.stores.count,
        'products.count': usage.products.count,
      },
      expires_at: null,
      refreshed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('getEntitlements failed:', {
      endpoint: `${BILLING_BASE}/subscription/usage`,
      message: error instanceof Error ? error.message : String(error),
      status: (error as any)?.status,
      code: (error as any)?.code,
      errors: (error as any)?.errors,
      errorType: error?.constructor?.name,
      errorKeys: error ? Object.keys(error) : [],
    });
    // Log the raw error separately for better visibility
    console.error('Raw error object:', error);
    throw error;
  }
}

/**
 * @deprecated Use getEntitlements() instead. This endpoint is account-level, not store-level.
 * Get usage/entitlement data for current organization.
 * GET /api/v1/merchant/billing/subscription/usage
 */
export async function getStoreEntitlements(
  storeId: string
): Promise<StoreEntitlement> {
  // Note: storeId parameter is not used as the endpoint is account-level
  return getEntitlements();
}

/**
 * Check if an action is allowed (quota check).
 * Uses /subscription/usage endpoint to get current limits.
 */
export async function checkEntitlement(
  storeId: string,
  featureKey: string
): Promise<{ allowed: boolean; reason?: string; current?: number; limit?: number }> {
  // Get usage data from subscription/usage endpoint
  const entitlements = await getEntitlements();
  
  // Client-side check based on feature key
  // This is a UX helper - backend should also enforce
  const usage = (entitlements as any).usage;
  const limit = usage?.[featureKey.split('.')[0]]?.limit ?? entitlements.features?.[featureKey];
  const current = usage?.[featureKey.split('.')[0]]?.count ?? entitlements.limits?.[featureKey.replace('.', '_')] ?? 0;
  
  return { 
    allowed: typeof limit === 'number' ? current < limit : true,
    current: typeof current === 'number' ? current : undefined,
    limit: typeof limit === 'number' ? limit : undefined
  };
}
