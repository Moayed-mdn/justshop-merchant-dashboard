/**
 * Trial Signup Page
 * Start free trial and select plan
 */

import { Metadata } from 'next';
import { TrialSignupClient } from './TrialSignupClient';
import { getPlans } from '@/lib/api/billing';
import { CheckCircle2 } from 'lucide-react';
import type { Plan } from '@/types/billing/plan';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Start Your Free Trial',
    description: 'Start your 14-day free trial. No credit card required.',
  };
}

export default async function TrialStartPage() {
  let plans: Plan[];

  try {
    plans = await getPlans();
  } catch {
    plans = [];
  }

  const sortedPlans = [...plans].sort((a, b) => a.sort_order - b.sort_order);

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
      {sortedPlans.length > 0 ? (
        <TrialSignupClient plans={sortedPlans} />
      ) : (
        <div className="text-center text-muted-foreground">
          <p>No plans are available right now. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
