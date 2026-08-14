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
