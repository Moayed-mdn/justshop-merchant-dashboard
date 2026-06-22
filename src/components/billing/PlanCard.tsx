/**
 * Plan Card (Client Component for click handling)
 * Individual subscription plan display card
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import type { Plan, BillingCycle } from '@/types/billing/plan';

interface PlanCardProps {
  plan: Plan;
  billingCycle: BillingCycle;
  isCurrent?: boolean;
  isPopular?: boolean;
  onSelect?: (planCode: string, billingCycle: BillingCycle) => void;
  disabled?: boolean;
}

export function PlanCard({
  plan,
  billingCycle,
  isCurrent = false,
  isPopular = false,
  onSelect,
  disabled = false,
}: PlanCardProps) {
  const price = plan.prices.find((p) => p.billing_cycle === billingCycle);

  if (!price) {
    return null;
  }

  const formatPrice = (amountCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amountCents / 100);
  };

  const handleSelect = () => {
    if (onSelect && !isCurrent && !disabled) {
      onSelect(plan.code, billingCycle);
    }
  };

  // Sort features by display order (if available) or alphabetically
  const sortedFeatures = [...plan.features].sort((a, b) => a.id - b.id);

  return (
    <div className={isPopular ? 'relative pt-4' : ''}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="default" className="whitespace-nowrap">
            Popular
          </Badge>
        </div>
      )}
      <Card className={`relative h-full ${isPopular ? 'border-primary shadow-lg' : ''}`}>

      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl uppercase tracking-wide">
            {plan.name.en || plan.code}
          </CardTitle>
          {plan.description?.en && <CardDescription>{plan.description.en}</CardDescription>}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{formatPrice(price.amount_cents)}</span>
          <span className="text-muted-foreground">
            /{billingCycle === 'annual' ? 'year' : 'month'}
          </span>
        </div>

        {billingCycle === 'annual' && (
          <div className="text-sm text-muted-foreground">
            {formatPrice(price.amount_cents / 12)}/month billed annually
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Features List */}
        <ul className="space-y-3" role="list">
          {sortedFeatures.map((feature) => {
            const displayValue =
              feature.value_type === 'limit' || feature.value_type === 'quota'
                ? feature.limit_value
                : feature.boolean_value
                  ? 'Included'
                  : null;

            return (
              <li key={feature.id} className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-sm font-medium">
                    {feature.feature_key.replace(/_/g, ' ').replace(/\./g, ' - ')}
                  </div>
                  {displayValue && (
                    <div className="text-xs text-muted-foreground">
                      {typeof displayValue === 'number'
                        ? `Up to ${displayValue.toLocaleString()}`
                        : displayValue}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Action Button */}
        <Button
          className="w-full"
          variant={isPopular ? 'default' : 'outline'}
          onClick={handleSelect}
          disabled={isCurrent || disabled}
        >
          {isCurrent ? 'Current Plan' : `Select ${plan.name.en || plan.code}`}
        </Button>
      </CardContent>
    </Card>
    </div>
  );
}
