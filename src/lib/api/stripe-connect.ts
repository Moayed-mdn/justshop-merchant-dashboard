/**
 * Stripe Connect API functions (client-side).
 * Store-scoped merchant payout setup — separate from account-level platform
 * billing (see lib/api/billing.ts).
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import { API_ROUTES } from '@/config/routes';
import type {
  StripeConnectStatus,
  StripeConnectOnboardResponse,
  StripeDashboardLinkResponse,
} from '@/types/stripe-connect';

/**
 * Get the current Stripe Connect account status for a store.
 */
export async function getStripeConnectStatus(
  storeSlug: string
): Promise<StripeConnectStatus> {
  const response = await clientApi.get<ApiResponse<StripeConnectStatus>>(
    API_ROUTES.store(storeSlug).stripeConnect().status()
  );
  return response.data;
}

/**
 * Create (if needed) the store's Stripe Connect account and return a fresh
 * onboarding URL. Requires an active platform subscription — the backend
 * returns 403 otherwise.
 *
 * The returned onboarding_url is single-use and expires in minutes: call
 * this again right before redirecting, never reuse a previously fetched URL.
 */
export async function createStripeConnectOnboarding(
  storeSlug: string
): Promise<StripeConnectOnboardResponse> {
  const response = await clientApi.post<ApiResponse<StripeConnectOnboardResponse>>(
    API_ROUTES.store(storeSlug).stripeConnect().onboard()
  );
  return response.data;
}

/**
 * Generate a fresh Stripe Express Dashboard login link for a store.
 *
 * Works as soon as the store has a Stripe account, even mid-onboarding —
 * the Express Dashboard itself walks the merchant through anything still
 * outstanding. The URL is single-use and expires quickly: call this again
 * right before each redirect, never reuse a previously fetched value.
 */
export async function getStripeDashboardLink(
  storeSlug: string
): Promise<StripeDashboardLinkResponse> {
  const response = await clientApi.post<ApiResponse<StripeDashboardLinkResponse>>(
    API_ROUTES.store(storeSlug).stripeConnect().dashboardLink()
  );
  return response.data;
}
