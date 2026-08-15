'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PlanCard } from '@/components/billing/PlanCard';
import { useToast } from '@/hooks/use-toast';
import { useStartTrial } from '@/hooks/billing/useStartTrial';
import { formatApiErrorMessage } from '@/lib/api/error-message';
import { useTranslations } from 'next-intl';
import type { Plan, BillingCycle } from '@/types/billing/plan';
import type { ApiError } from '@/types/api';

interface TrialSignupClientProps {
  plans: Plan[];
}

export function TrialSignupClient({ plans }: TrialSignupClientProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const { toast } = useToast();
  const startTrial = useStartTrial();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  
  const t = useTranslations('billing.trial');
  const tErrors = useTranslations('billing.errors');

  const handlePlanSelect = async (planSlug: string, cycle: BillingCycle) => {
    try {
      const plan = plans.find(p => p.code === planSlug);
      const price = plan?.prices.find(p => p.billing_cycle === cycle);
      if (!price) {
        toast({ 
          title: tErrors('error'), 
          description: tErrors('planPriceNotFound'), 
          variant: 'destructive' 
        });
        return;
      }

      const { url } = await startTrial.mutateAsync({
        plan_price_id: price.id,
        success_url: `${window.location.origin}/merchant/billing?trial=success`,
        cancel_url: `${window.location.origin}/merchant/billing/trial/start?canceled=true`,
      });

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = formatApiErrorMessage(apiError, { fallbackMessage: tErrors('trialStartFailed') });
      
      toast({
        title: tErrors('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <RadioGroup
          value={billingCycle}
          onValueChange={(value) => setBillingCycle(value as BillingCycle)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly">{t('monthlyLabel')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="annual" id="annual" />
            <Label htmlFor="annual">{t('annualLabel')}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            isPopular={index === 1}
            onSelect={handlePlanSelect}
            disabled={startTrial.isPending}
          />
        ))}
      </div>

      {/* Fine Print */}
      <p className="text-center text-sm text-muted-foreground">
        {t('trialStarts')} {t('cancelAnytime')}
      </p>
    </div>
  );
}
