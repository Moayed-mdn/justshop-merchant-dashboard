'use client';

/**
 * Hook for starting a free trial.
 * Returns Stripe Checkout URL to redirect user.
 */

import { useMutation } from '@tanstack/react-query';
import { startTrial } from '@/lib/api/billing';
import type { StartTrialPayload, StartTrialResponse } from '@/types/billing/subscription';
import type { ApiError } from '@/types/api';

export function useStartTrial() {
  return useMutation<StartTrialResponse, ApiError, StartTrialPayload>({
    mutationFn: startTrial,
  });
}
