'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import MarketingPagesContent from '@/features/dashboard/cms-pages/MarketingPagesContent';
import { useTranslations } from 'next-intl';

const INITIAL_FILTERS = {
  search:   '',
  status:   'all' as const,
  template: 'all' as const,
  page:     1,
  perPage:  15,
};

/**
 * Merchant Workspace — Marketing Pages list.
 * Displays all CMS marketing pages for the currently active store.
 */
export default function MerchantCmsPagesPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t           = useTranslations('cmsPages');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to view its marketing pages."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MarketingPagesContent
        storeId={String(activeStore.id)}
        initialFilters={INITIAL_FILTERS}
      />
    </div>
  );
}
