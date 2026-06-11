/**
 * Plan Comparison Table (Server Component)
 * Feature comparison across all plans
 */

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Infinity } from 'lucide-react';
import type { Plan, PlanFeature } from '@/types/billing/plan';

interface PlanComparisonTableProps {
  plans: Plan[];
}

export function PlanComparisonTable({ plans }: PlanComparisonTableProps) {
  // Collect all unique feature keys across all plans
  const allFeatureKeys = new Set<string>();
  const featuresByPlan = new Map<number, Map<string, PlanFeature>>();

  plans.forEach((plan) => {
    const planFeatures = new Map<string, PlanFeature>();
    plan.features.forEach((feature) => {
      allFeatureKeys.add(feature.feature_key);
      planFeatures.set(feature.feature_key, feature);
    });
    featuresByPlan.set(plan.id, planFeatures);
  });

  const featureKeys = Array.from(allFeatureKeys);

  const formatFeatureValue = (feature: PlanFeature) => {
    if (feature.value_type === 'unlimited') {
      return <Infinity className="inline h-5 w-5 text-green-600 dark:text-green-400" />;
    }
    if (feature.value_type === 'boolean') {
      return feature.boolean_value ? (
        <Check className="inline h-5 w-5 text-green-600 dark:text-green-400" />
      ) : (
        <X className="inline h-5 w-5 text-muted-foreground" />
      );
    }
    if (feature.value_type === 'limit' || feature.value_type === 'quota') {
      return (
        <span className="font-semibold tabular-nums">
          {feature.limit_value?.toLocaleString()}
        </span>
      );
    }
    return <span className="text-muted-foreground">—</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Feature</TableHead>
                {plans.map((plan) => (
                  <TableHead key={plan.id} className="text-center">
                    <div className="font-semibold">{plan.name.en || plan.code}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureKeys.map((featureKey) => {
                // Get display name from first plan that has this feature
                const firstFeature = Array.from(featuresByPlan.values())
                  .find((features) => features.has(featureKey))
                  ?.get(featureKey);

                const displayName = featureKey
                  .replace(/_/g, ' ')
                  .replace(/\./g, ' - ')
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                return (
                  <TableRow key={featureKey}>
                    <TableCell className="font-medium">{displayName}</TableCell>
                    {plans.map((plan) => {
                      const feature = featuresByPlan.get(plan.id)?.get(featureKey);

                      if (!feature) {
                        return (
                          <TableCell key={plan.id} className="text-center">
                            <X className="inline h-5 w-5 text-muted-foreground" />
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={plan.id} className="text-center">
                          {formatFeatureValue(feature)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
