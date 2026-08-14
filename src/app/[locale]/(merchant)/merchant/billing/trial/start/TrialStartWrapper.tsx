'use client';

import { useSubscription } from '@/hooks/billing/useSubscription';
import { useRouter } from '@/lib/navigation';
import { TrialSignupClient } from './TrialSignupClient';
import { CheckCircle2 } from 'lucide-react';
import type { Plan } from '@/types/billing/plan';

export function TrialStartWrapper({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const { data: subscriptionData, isLoading } = useSubscription();

  // Extract subscription from response
  const subscription = subscriptionData?.subscription;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirect if user already has an active subscription
  if (subscription) {
    router.replace('/merchant/billing');
    return null;
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Start Your Free Trial</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          14 days free. No credit card required.
        </p>
      </div>

      {/* Trial Benefits */}
      <div className="mx-auto max-w-3xl">
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            'Full access to all features',
            'No credit card required',
            'Cancel anytime',
            'Upgrade to paid plan anytime',
          ].map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
              <p className="text-sm">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Selection - Client Component */}
      {plans.length > 0 ? (
        <TrialSignupClient plans={plans} />
      ) : (
        <div className="text-center text-muted-foreground">
          <p>No plans are available right now. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
