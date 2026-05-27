'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import CategoriesContent from '@/features/dashboard/categories/CategoriesContent';
import { useTranslations } from 'next-intl';

const INITIAL_FILTERS = {
  is_active: 'all' as const,
  page: 1,
  perPage: 10,
};

/**
 * Merchant Workspace Categories Page.
 * Displays the categories list for the currently active store.
 */
export default function MerchantCategoriesPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('nav');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('categories')}</h1>
        </div>
        <WorkspaceEmptyState 
          title="No active store"
          message="Select a store from the switcher to view its categories."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoriesContent storeId={String(activeStore.id)} initialFilters={INITIAL_FILTERS} />
    </div>
  );
}
