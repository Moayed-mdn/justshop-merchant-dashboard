'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import CreateCategoryForm from '@/features/dashboard/categories/CreateCategoryForm';
import { useTranslations } from 'next-intl';
import { getStoreRouteParam } from '@/lib/stores/route-param';

/**
 * Merchant Workspace — Create Category Page.
 * Canonical route: /merchant/categories/new
 */
export default function MerchantCategoryCreatePage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('categories');

  const storeSlug = getStoreRouteParam(activeStore);

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.createTitle')}</h1>
        </div>
        <WorkspaceEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateCategoryForm storeSlug={storeSlug} />
    </div>
  );
}
