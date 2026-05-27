'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { StoreSettingsForm } from '@/features/merchant/settings/StoreSettingsForm';
import { useTranslations } from 'next-intl';

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
        <div>
          <h1 className="text-2xl font-bold">{t('settings')}</h1>
        </div>
        <WorkspaceEmptyState 
          title="No active store"
          message="Select a store from the switcher to manage its settings."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{activeStore.name} {t('settings')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage configuration for {activeStore.name}.
        </p>
      </div>

      <StoreSettingsForm store={activeStore} />
    </div>
  );
}
