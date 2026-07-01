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
import { PlanCard, PlanComparisonTable } from '@/components/billing';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DowngradeConfirmDialog } from '@/components/billing/DowngradeConfirmDialog';
import type { BillingCycle } from '@/types/billing/plan';
import { useToast } from '@/hooks/use-toast';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { startTrial } from '@/lib/api/billing';

export function PlansPageClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Downgrade confirmation dialog state
  const [downgradeDialog, setDowngradeDialog] = useState<{
    open: boolean;
    currentPlan: string;
    targetPlan: string;
    targetPlanCode: string;
    billingCycle: BillingCycle;
    periodEndDate?: string;
  }>({
    open: false,
    currentPlan: '',
    targetPlan: '',
    targetPlanCode: '',
    billingCycle: 'annual',
  });

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subscription, refetch: refetchSubscription } = useSubscription();
  const upgradeMutation = useUpgradeSubscription();
  
  // Get active store from bootstrap
  const activeStore = useBootstrapStore((state) => state.activeStore);

  const handlePlanSelect = async (planCode: string, cycle: BillingCycle) => {
    if (!plans || !subscription) return;

    // Validate active store exists
    if (!activeStore) {
      toast({
        title: 'Error',
        description: 'No active store found. Please select a store first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);

      const selectedPlan = plans.find((p) => p.code === planCode);
      const currentPlan = plans.find((p) => p.id === subscription.plan_id);

      if (!selectedPlan || !currentPlan) return;

      // Get store ID from active store
      const storeId = activeStore.id;

      // Check if this is a trial subscription without Stripe subscription
      const isTrialWithoutStripe = subscription.status === 'trialing' && !subscription.provider_subscription_id;

      if (isTrialWithoutStripe) {
        // For trial users, create a checkout session for the selected plan
        try {
          // Find the price for the selected plan and billing cycle
          const selectedPlan = plans.find((p) => p.code === planCode);
          if (!selectedPlan) {
            throw new Error('Plan not found');
          }

          const price = selectedPlan.prices.find((p) => p.billing_cycle === cycle);
          if (!price) {
            throw new Error('Price not found for selected billing cycle');
          }

          const payload = {
            plan_price_id: price.id,
            // Note: Stripe will append ?session_id={CHECKOUT_SESSION_ID} automatically if not present
            // Backend validation rejects the {CHECKOUT_SESSION_ID} placeholder, so we omit it
            // and let Stripe handle appending the session ID
            success_url: `${window.location.origin}/merchant/billing/checkout-success`,
            cancel_url: `${window.location.origin}/merchant/billing/plans`,
          };
          
          console.log('Starting checkout with payload:', payload);
          console.log('Selected plan:', selectedPlan);
          console.log('Selected price:', price);
          
          const { url } = await startTrial(payload);
          
          toast({
            title: 'Redirecting to checkout',
            description: 'Setting up your subscription...',
          });
          
          // Redirect to Stripe Checkout
          window.location.href = url;
          return;
        } catch (error) {
          // Enhanced error logging for better debugging
          console.error('Checkout creation failed:', {
            error,
            message: error instanceof Error ? error.message : String(error),
            status: (error as any)?.status,
            code: (error as any)?.code,
            errors: (error as any)?.errors,
            stack: error instanceof Error ? error.stack : undefined,
          });
          
          // Extract meaningful error message
          let errorMessage = 'Failed to start checkout. Please try again.';
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'object' && error !== null) {
            const apiError = error as { message?: string; errors?: Record<string, string[]> };
            if (apiError.message) {
              errorMessage = apiError.message;
            } else if (apiError.errors && Object.keys(apiError.errors).length > 0) {
              errorMessage = Object.values(apiError.errors).flat().join(', ');
            }
          }
          
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
          return;
        }
      }

      // Determine if upgrade or downgrade based on sort_order
      const isUpgrade = selectedPlan.sort_order > currentPlan.sort_order;

      if (isUpgrade) {
        // Handle upgrade - immediate action
        await upgradeMutation.mutateAsync({
          plan_code: planCode,
          billing_cycle: cycle,
          store_id: storeId,
          prorate: true,
        });

        toast({
          title: 'Plan upgraded!',
          description: `You've been upgraded to ${selectedPlan.name.en}`,
        });
        
        router.push('/merchant/billing');
        router.refresh();
      } else {
        // Handle downgrade - show confirmation dialog first
        setDowngradeDialog({
          open: true,
          currentPlan: currentPlan.name.en || currentPlan.code,
          targetPlan: selectedPlan.name.en || selectedPlan.code,
          targetPlanCode: planCode,
          billingCycle: cycle,
          periodEndDate: subscription.current_period_ends_at || undefined,
        });
      }
    } catch (error) {
      console.error('Plan change failed:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to change plan. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as { message?: string; errors?: Record<string, string[]> };
        if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.errors && Object.keys(apiError.errors).length > 0) {
          errorMessage = Object.values(apiError.errors).flat().join(', ');
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDowngradeSuccess = async () => {
    // Refetch subscription to get updated data with pending plan
    await refetchSubscription();
    
    toast({
      title: 'Downgrade scheduled',
      description: `Your plan will change to ${downgradeDialog.targetPlan} at the end of your billing period. You'll keep full access to your current plan until then.`,
    });
    
    // Navigate to billing page to show the pending downgrade info
    router.push('/merchant/billing');
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

  // Check if user is on trial without Stripe subscription
  const isTrialWithoutStripe = subscription?.status === 'trialing' && !subscription?.provider_subscription_id;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {isTrialWithoutStripe 
            ? 'Start your paid subscription by selecting a plan'
            : 'Select the plan that fits your business needs'}
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {sortedPlans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            isCurrent={!isTrialWithoutStripe && subscription?.plan_id === plan.id}
            isPopular={index === 1} // Middle plan is popular
            onSelect={handlePlanSelect}
            disabled={isProcessing}
          />
        ))}
      </div>

      {/* Feature Comparison Table */}
      <PlanComparisonTable plans={sortedPlans} />

      {/* Downgrade Confirmation Dialog */}
      <DowngradeConfirmDialog
        open={downgradeDialog.open}
        onOpenChange={(open) => setDowngradeDialog({ ...downgradeDialog, open })}
        currentPlan={downgradeDialog.currentPlan}
        targetPlan={downgradeDialog.targetPlan}
        targetPlanCode={downgradeDialog.targetPlanCode}
        billingCycle={downgradeDialog.billingCycle}
        periodEndDate={downgradeDialog.periodEndDate}
        onSuccess={handleDowngradeSuccess}
      />
    </div>
  );
}
