'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import MarketingPagesContent from '@/features/dashboard/cms-pages/MarketingPagesContent';
import { useTranslations } from 'next-intl';
import { getStoreRouteParam } from '@/lib/stores/route-param';

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
        <WorkspaceEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MarketingPagesContent
        storeSlug={getStoreRouteParam(activeStore)}
        initialFilters={INITIAL_FILTERS}
      />
    </div>
  );
}
