/**
 * Plans Page Client Component
 * Plan selection with billing cycle toggle
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlans } from '@/hooks/billing/usePlans';
import { useSubscription } from '@/hooks/billing/useSubscription';
import { useUpgradeSubscription } from '@/hooks/billing/useUpgradeSubscription';
import { useDowngradeSubscription } from '@/hooks/billing/useDowngradeSubscription';
import { PlanCard, PlanComparisonTable } from '@/components/billing';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { BillingCycle } from '@/types/billing/plan';
import { useToast } from '@/hooks/use-toast';

export function PlansPageClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subscription } = useSubscription();
  const upgradeMutation = useUpgradeSubscription();
  const downgradeMutation = useDowngradeSubscription();

  const handlePlanSelect = async (planCode: string, cycle: BillingCycle) => {
    if (!plans || !subscription) return;

    try {
      setIsProcessing(true);

      const selectedPlan = plans.find((p) => p.code === planCode);
      const currentPlan = plans.find((p) => p.id === subscription.plan_id);

      if (!selectedPlan || !currentPlan) return;

      // Determine if upgrade or downgrade based on sort_order
      const isUpgrade = selectedPlan.sort_order > currentPlan.sort_order;

      if (isUpgrade) {
        await upgradeMutation.mutateAsync({
          plan_code: planCode,
          billing_cycle: cycle,
          prorate: true,
        });

        toast({
          title: 'Plan upgraded!',
          description: `You've been upgraded to ${selectedPlan.name.en}`,
        });
      } else {
        await downgradeMutation.mutateAsync({
          plan_code: planCode,
          billing_cycle: cycle,
          apply_immediately: false,
        });

        toast({
          title: 'Downgrade scheduled',
          description: `Your plan will change to ${selectedPlan.name.en} at the end of your billing period`,
        });
      }

      router.push('/merchant/billing');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to change plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (plansLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="mt-2 text-lg text-muted-foreground">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="mt-2 text-lg text-muted-foreground">No plans available</p>
        </div>
      </div>
    );
  }

  // Sort plans by sort_order
  const sortedPlans = [...plans].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select the plan that fits your business needs
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-4 rounded-lg border p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billingCycle === 'annual'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Annual
            <span className="ms-1 text-xs">(Save 20%)</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedPlans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            isCurrent={subscription?.plan_id === plan.id}
            isPopular={index === 1} // Middle plan is popular
            onSelect={handlePlanSelect}
            disabled={isProcessing}
          />
        ))}
      </div>

      {/* Feature Comparison Table */}
      <PlanComparisonTable plans={sortedPlans} />
    </div>
  );
}
