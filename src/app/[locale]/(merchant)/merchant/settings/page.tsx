'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { MerchantPageHeader } from '@/features/merchant/components/MerchantPageHeader';
import { StoreSettingsForm } from '@/features/merchant/settings/StoreSettingsForm';
import { useTranslations } from 'next-intl';
import { Settings } from 'lucide-react';

/**
 * Merchant Workspace Settings Page.
 * Displays the settings for the currently active store.
 */
export default function MerchantSettingsPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('nav');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <MerchantPageHeader
          title={t('settings')}
          description="Manage store settings and configuration."
        />
        <WorkspaceEmptyState 
          icon={Settings}
          title="No active store"
          message="Select a store from the switcher to configure its settings and preferences."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MerchantPageHeader
        title={`${activeStore.name} ${t('settings')}`}
        description={`Manage configuration for ${activeStore.name}.`}
      />

      <StoreSettingsForm store={activeStore} />
    </div>
  );
}
