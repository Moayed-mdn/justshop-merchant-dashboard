'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { MerchantPageHeader } from '@/features/merchant/components/MerchantPageHeader';
import { StoreSettingsForm } from '@/features/merchant/settings/StoreSettingsForm';
import { BillingSettingsCard } from '@/features/merchant/settings/BillingSettingsCard';
import { ProfileAvatarCard } from '@/features/merchant/settings/ProfileAvatarCard';
import { ProfileInfoCard } from '@/features/merchant/settings/ProfileInfoCard';
import { ProfilePasswordCard } from '@/features/merchant/settings/ProfilePasswordCard';
import { ProfileAccountCard } from '@/features/merchant/settings/ProfileAccountCard';
import { useTranslations } from 'next-intl';
import { Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

/**
 * Merchant Workspace Settings Page.
 * Displays the settings for the currently active store and user profile.
 */
export default function MerchantSettingsPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('settings');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <MerchantPageHeader
          title={t('title')}
          description={t('subtitle')}
        />
        <WorkspaceEmptyState 
          icon={Settings}
          title={t('noActiveStore')}
          message={t('noActiveStoreMessage')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MerchantPageHeader
        title={t('title')}
        description={t('subtitle')}
      />

      {/* Profile Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('profile.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('profile.subtitle')}
          </p>
        </div>
        <div className="space-y-6">
          <ProfileAvatarCard />
          <ProfileInfoCard />
          <ProfilePasswordCard />
          <ProfileAccountCard />
        </div>
      </div>

      <Separator />

      {/* Billing Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('billing.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('billing.subtitle')}
          </p>
        </div>
        <BillingSettingsCard />
      </div>

      <Separator />

      {/* Store Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('store.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('store.subtitle')}
          </p>
        </div>
        <StoreSettingsForm store={activeStore} />
      </div>
    </div>
  );
}
