'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import CreateProductForm from '@/features/dashboard/products/CreateProductForm';
import { useTranslations } from 'next-intl';

/**
 * Merchant Workspace — Create Product Page.
 * Canonical route: /merchant/products/new
 */
export default function MerchantProductCreatePage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('products');

  const storeId = activeStore ? String(activeStore.id) : '';

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.createTitle')}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to create a product."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateProductForm storeId={storeId} />
    </div>
  );
}
