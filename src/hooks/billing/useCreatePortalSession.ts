'use client';

/**
 * Hook for creating Stripe Billing Portal session.
 * Returns URL to redirect user to Stripe-hosted billing portal.
 */

import { useMutation } from '@tanstack/react-query';
import { createPortalSession } from '@/lib/api/billing';
import type { ApiError } from '@/types/api';

export function useCreatePortalSession() {
  return useMutation<{ url: string }, ApiError, string>({
    mutationFn: createPortalSession,
  });
}
