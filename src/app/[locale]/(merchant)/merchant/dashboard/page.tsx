'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { MerchantPageHeader } from '@/features/merchant/components/MerchantPageHeader';
import { PostOnboardingChecklist } from '@/features/merchant/components/PostOnboardingChecklist';
import { WorkspaceDashboardContent } from '@/features/merchant/dashboard/WorkspaceDashboardContent';
import { useTranslations } from 'next-intl';
import { LayoutDashboard } from 'lucide-react';

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
        <MerchantPageHeader
          title={t('title')}
          description={t('subtitle')}
        />
        <WorkspaceEmptyState 
          icon={LayoutDashboard}
          title="No active store"
          message="Select a store from the switcher to see your sales, orders, and performance at a glance."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MerchantPageHeader
        title={t('title')}
        description={t('subtitle')}
      />
      <PostOnboardingChecklist key={activeStore.id} />
      <WorkspaceDashboardContent storeId={String(activeStore.id)} />
    </div>
  );
}
