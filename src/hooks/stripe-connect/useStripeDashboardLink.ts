'use client';

/**
 * Hook for opening a store's Stripe Express Dashboard.
 * Returns a fresh, single-use login link each call — never cache the URL.
 */

import { useMutation } from '@tanstack/react-query';
import { getStripeDashboardLink } from '@/lib/api/stripe-connect';
import type { StripeDashboardLinkResponse } from '@/types/stripe-connect';
import type { ApiError } from '@/types/api';

export function useStripeDashboardLink(storeSlug: string | undefined) {
  return useMutation<StripeDashboardLinkResponse, ApiError, void>({
    mutationFn: () => getStripeDashboardLink(storeSlug as string),
  });
}
