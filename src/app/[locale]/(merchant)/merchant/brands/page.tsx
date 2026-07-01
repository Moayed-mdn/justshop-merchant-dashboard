'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import BrandsContent from '@/features/dashboard/brands/BrandsContent';
import { useTranslations } from 'next-intl';
import { getStoreRouteParam } from '@/lib/stores/route-param';

const INITIAL_FILTERS = {
  is_active: 'all' as const,
  page: 1,
  perPage: 15,
};

/**
 * Merchant Workspace Brands Page.
 * Displays the brands list for the currently active store.
 */
export default function MerchantBrandsPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('nav');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('brands')}</h1>
        </div>
        <WorkspaceEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BrandsContent storeSlug={getStoreRouteParam(activeStore)} initialFilters={INITIAL_FILTERS} />
    </div>
  );
}
