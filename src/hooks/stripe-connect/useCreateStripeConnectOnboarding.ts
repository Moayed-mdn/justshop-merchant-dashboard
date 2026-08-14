'use client';

/**
 * Hook for creating/continuing a store's Stripe Connect onboarding.
 * Returns a Stripe-hosted onboarding URL to redirect the merchant to.
 *
 * The URL is single-use and short-lived — call mutateAsync again right
 * before each redirect rather than reusing a previously fetched value.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStripeConnectOnboarding } from '@/lib/api/stripe-connect';
import { queryKeys } from '@/lib/queryKeys';
import type { StripeConnectOnboardResponse } from '@/types/stripe-connect';
import type { ApiError } from '@/types/api';

export function useCreateStripeConnectOnboarding(storeSlug: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<StripeConnectOnboardResponse, ApiError, void>({
    mutationFn: () => createStripeConnectOnboarding(storeSlug as string),
    onSuccess: () => {
      if (storeSlug) {
        queryClient.invalidateQueries({ queryKey: queryKeys.stripeConnect(storeSlug).status() });
      }
    },
  });
}
