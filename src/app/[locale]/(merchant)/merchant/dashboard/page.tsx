'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { WorkspaceDashboardContent } from '@/features/merchant/dashboard/WorkspaceDashboardContent';
import { useTranslations } from 'next-intl';

/**
 * Merchant Workspace Dashboard Page.
 * Displays the dashboard for the currently active store.
 * If no store is active, shows an empty state.
 */
export default function MerchantDashboardPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('dashboard');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <WorkspaceEmptyState 
          title="No active store"
          message="Select a store from the switcher to view its dashboard overview."
        />
      </div>
    );
  }

  return <WorkspaceDashboardContent storeId={String(activeStore.id)} />;
}
