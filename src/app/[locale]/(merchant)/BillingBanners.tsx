/**
 * Billing Banners Component
 * Displays trial and grace period banners conditionally
 */

import { getSubscription } from '@/lib/api/billing';
import { TrialBanner, GracePeriodBanner } from '@/components/billing';
import { BillingBannersClient } from './BillingBannersClient';

export async function BillingBanners() {
  let subscriptionData = null;
  
  try {
    subscriptionData = await getSubscription();
  } catch (error) {
    // Silently fail if subscription fetch fails
    // User might not have a subscription yet
    return null;
  }

  const subscription = subscriptionData?.subscription;

  if (!subscription) {
    return null;
  }

  const showTrialBanner =
    subscription.status === 'trialing' && subscription.trial_ends_at;

  const showGraceBanner =
    subscription.status === 'past_due' && subscription.grace_period_ends_at;

  return (
    <div className="space-y-4 mb-6">
      {/* Trial Banner */}
      {showTrialBanner && subscription.trial_ends_at && (
        <TrialBanner trialEndsAt={subscription.trial_ends_at} />
      )}

      {/* Grace Period Banner */}
      {showGraceBanner && subscription.grace_period_ends_at && (
        <BillingBannersClient gracePeriodEndsAt={subscription.grace_period_ends_at} />
      )}
    </div>
  );
}
