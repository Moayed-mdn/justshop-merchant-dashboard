'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import CreateBrandForm from '@/features/dashboard/brands/CreateBrandForm';
import { useTranslations } from 'next-intl';

/**
 * Merchant Workspace — Create Brand Page.
 * Canonical route: /merchant/brands/new
 * 
 * This is the workspace-level brand creation page that uses the active store
 * from the merchant's context. For direct store-scoped access, use the route:
 * /stores/[storeId]/brands/new
 */
export default function MerchantBrandCreatePage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('brands');

  const storeId = activeStore ? String(activeStore.id) : '';

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.createTitle', { default: 'Create Brand' })}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to create a brand."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateBrandForm storeId={storeId} />
    </div>
  );
}
