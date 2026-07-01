/**
 * Billing Banners Client Component
 * Handles client-side interactions for grace period banner
 */

'use client';

import { useRouter } from 'next/navigation';
import { GracePeriodBanner } from '@/components/billing';

interface BillingBannersClientProps {
  gracePeriodEndsAt: string;
}

export function BillingBannersClient({ gracePeriodEndsAt }: BillingBannersClientProps) {
  const router = useRouter();

  const handleUpdatePayment = () => {
    // Navigate to billing settings page to update payment method
    router.push('/merchant/settings/billing');
  };

  return (
    <GracePeriodBanner
      gracePeriodEndsAt={gracePeriodEndsAt}
      onUpdatePayment={handleUpdatePayment}
    />
  );
}
