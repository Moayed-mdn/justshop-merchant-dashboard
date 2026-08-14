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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { BillingCycle } from '@/types/billing/plan';
import type { PlanFeature } from '@/types/billing/plan';
import { useToast } from '@/hooks/use-toast';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { startTrial, moveToCurrentPlanVersion } from '@/lib/api/billing';
import { Info, Sparkles, ArrowRight } from 'lucide-react';

/**
 * Format a feature for display in the legacy plan card.
 * Returns a human-readable label and value.
 */
function formatFeature(feature: PlanFeature): { label: string; value: string } {
  // Convert feature_key to readable label (e.g., "stores.max" -> "Stores")
  const labelMap: Record<string, string> = {
    'stores.max': 'Stores',
    'products.max': 'Products',
    'users.max': 'Team Members',
    'custom_domain.enabled': 'Custom Domain',
    'api.access': 'API Access',
    'webhooks.enabled': 'Webhooks',
    'support.priority': 'Priority Support',
    'analytics.advanced': 'Advanced Analytics',
  };
  
  const label = labelMap[feature.feature_key] || feature.feature_key;
  
  // Format the value based on type
  let value: string;
  
  if (feature.value_type === 'boolean') {
    value = feature.boolean_value ? 'Enabled' : 'Disabled';
  } else if (feature.value_type === 'unlimited') {
    value = 'Unlimited';
  } else if (feature.value_type === 'limit' && feature.limit_value !== null) {
    value = `Up to ${feature.limit_value}`;
  } else {
    value = 'Not specified';
  }
  
  return { label, value };
}

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
  const { data: subscriptionData, refetch: refetchSubscription } = useSubscription();
  const upgradeMutation = useUpgradeSubscription();
  
  // Extract subscription from response
  const subscription = subscriptionData?.subscription;
  const planIsCurrentOffering = subscriptionData?.plan_is_current_offering;
  
  // Get active store from bootstrap
  const activeStore = useBootstrapStore((state) => state.activeStore);

  const handlePlanSelect = async (planCode: string, cycle: BillingCycle) => {
    console.log('[PlansPageClient] handlePlanSelect called', {
      planCode,
      cycle,
      hasPlans: !!plans,
      hasSubscription: !!subscription,
      hasActiveStore: !!activeStore,
    });
    
    if (!plans || !subscription) {
      console.error('[PlansPageClient] Missing plans or subscription', {
        plans: !!plans,
        subscription: !!subscription,
      });
      return;
    }

    // Validate active store exists
    if (!activeStore) {
      console.error('[PlansPageClient] No active store found');
      toast({
        title: 'Error',
        description: 'No active store found. Please select a store first.',
        variant: 'destructive',
      });
      return;
    }

    console.log('[PlansPageClient] Starting plan selection process', {
      storeId: activeStore.id,
      storeName: activeStore.name,
    });

    try {
      setIsProcessing(true);

      const selectedPlan = plans.find((p) => p.code === planCode);
      const currentPlan = plans.find((p) => p.id === subscription.plan_id);

      console.log('[PlansPageClient] Plan lookup', {
        selectedPlan: selectedPlan ? { id: selectedPlan.id, code: selectedPlan.code } : null,
        currentPlan: currentPlan ? { id: currentPlan.id, code: currentPlan.code } : null,
        subscriptionPlanId: subscription.plan_id,
        availablePlanIds: plans.map(p => p.id),
      });

      if (!selectedPlan) {
        console.error('[PlansPageClient] Selected plan not found!', { planCode });
        toast({
          title: 'Error',
          description: 'Selected plan not found',
          variant: 'destructive',
        });
        return;
      }
      
      // If current plan not found in available plans (archived/superseded),
      // treat as upgrade (safer than blocking the action)
      if (!currentPlan) {
        console.warn('[PlansPageClient] Current plan not in available plans list', {
          subscriptionPlanId: subscription.plan_id,
          availablePlanIds: plans.map(p => p.id),
        });
      }

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
      // If currentPlan not found (archived/superseded), treat as upgrade for safety
      const isUpgrade = !currentPlan || selectedPlan.sort_order > currentPlan.sort_order;

      console.log('[PlansPageClient] Plan comparison', {
        isUpgrade,
        selectedSortOrder: selectedPlan.sort_order,
        currentSortOrder: currentPlan?.sort_order,
        hasCurrentPlan: !!currentPlan,
      });

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
        // Note: If currentPlan is null, we won't reach here (treated as upgrade above)
        setDowngradeDialog({
          open: true,
          currentPlan: currentPlan!.name.en || currentPlan!.code,
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

  // Check if current plan is in the public plans list
  const currentPlanInPublicList = subscription ? sortedPlans.find(p => p.id === subscription.plan_id) : null;
  const currentPlanIsLegacy = subscription && !currentPlanInPublicList;

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

      {/* Legacy Plan Card - Show if user is on a plan not in public list */}
      {currentPlanIsLegacy && subscription.plan && (
        <div className="border-2 border-amber-500 rounded-lg p-6 bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">
                  {subscription.plan.name?.en || subscription.plan.code}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                  Your Current Plan
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                  Legacy
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                This plan is no longer available to new subscribers. Your current pricing and limits remain unchanged and will continue until you choose to upgrade or downgrade.
              </p>
            </div>
          </div>

          {/* Show current plan features if available */}
          {subscription.plan.features && subscription.plan.features.length > 0 && (
            <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                Your Current Features & Limits
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subscription.plan.features.map((feature) => {
                  const { label, value } = formatFeature(feature);
                  return (
                    <div key={feature.id} className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <div className="text-sm">
                        <span className="font-medium">
                          {label}:
                        </span>{' '}
                        <span className="text-muted-foreground">
                          {value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Show pricing info if available */}
          {subscription.plan.prices && subscription.plan.prices.length > 0 && (
            <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                Your Current Pricing
              </h4>
              <div className="flex gap-4 flex-wrap">
                {subscription.plan.prices
                  .filter(price => price.is_active)
                  .map((price) => (
                    <div key={price.id} className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">
                        {price.currency === 'USD' ? '$' : price.currency}
                        {(price.amount_cents / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {price.billing_cycle}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upgrade Available Prompt - Show if plan has been superseded */}
      {currentPlanIsLegacy && subscription.plan?.superseded_by_plan_id && (() => {
        // Find the new plan version in the public plans list
        const newPlanVersion = sortedPlans.find(p => p.id === subscription.plan.superseded_by_plan_id);
        
        if (!newPlanVersion) {
          return null; // New plan not found in public plans
        }

        const handleViewNewPlan = () => {
          // Scroll to the new plan card in the grid
          const planCard = document.getElementById(`plan-card-${newPlanVersion.id}`);
          if (planCard) {
            planCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a highlight effect
            planCard.classList.add('ring-4', 'ring-primary', 'ring-offset-2');
            setTimeout(() => {
              planCard.classList.remove('ring-4', 'ring-primary', 'ring-offset-2');
            }, 3000);
          }
        };

        const handleUpgradeToCurrentVersion = async () => {
          try {
            setIsProcessing(true);
            
            // Use the dedicated move-to-current-version endpoint
            // This bypasses tier checking for same-tier plan version updates
            await moveToCurrentPlanVersion();
            
            toast({
              title: 'Plan Updated!',
              description: `You've been moved to ${newPlanVersion.name?.en || newPlanVersion.code}`,
            });
            
            // Refetch subscription data
            await refetchSubscription();
            
            // Redirect to billing page
            router.push('/merchant/billing');
            router.refresh();
          } catch (error) {
            console.error('Move to current version failed:', error);
            
            let errorMessage = 'Failed to update plan. Please try again.';
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

        return (
          <Alert className="border-primary bg-primary/5">
            <Sparkles className="h-5 w-5 text-primary" />
            <AlertTitle className="flex items-center gap-2 text-lg font-semibold">
              New Version Available
            </AlertTitle>
            <AlertDescription className="mt-2">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  An updated version of your plan is now available with improved features and benefits. 
                  Check out <span className="font-semibold text-foreground">{newPlanVersion.name?.en || newPlanVersion.code}</span> below to see what's new.
                </p>
                
                {/* Show key differences if available */}
                {newPlanVersion.features && subscription.plan.features && (
                  <div className="text-sm">
                    <p className="font-medium mb-2 text-foreground">What's new in this version:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {newPlanVersion.features.slice(0, 3).map((feature) => {
                        const { label, value } = formatFeature(feature);
                        return (
                          <li key={feature.id} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{label}: {value}</span>
                          </li>
                        );
                      })}
                      {newPlanVersion.features.length > 3 && (
                        <li className="text-xs italic">...and more features</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={handleViewNewPlan}
                    variant="default"
                    size="sm"
                    className="gap-2"
                  >
                    <Info className="h-4 w-4" />
                    View New Plan
                  </Button>
                  <Button
                    onClick={handleUpgradeToCurrentVersion}
                    variant="outline"
                    size="sm"
                    disabled={isProcessing}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        );
      })()}

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
          <div key={plan.id} id={`plan-card-${plan.id}`} className="transition-all duration-300">
            <PlanCard
              plan={plan}
              billingCycle={billingCycle}
              // Only highlight if: not trial AND plan is in public list AND matches subscription
              isCurrent={!isTrialWithoutStripe && !currentPlanIsLegacy && subscription?.plan_id === plan.id}
              isPopular={index === 1} // Middle plan is popular
              onSelect={handlePlanSelect}
              disabled={isProcessing}
            />
          </div>
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
