'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import ProductsContent from '@/features/dashboard/products/ProductsContent';
import { useTranslations } from 'next-intl';

const INITIAL_FILTERS = {
  search: '',
  status: 'all' as const,
  page: 1,
  perPage: 10,
};

/**
 * Merchant Workspace Products Page.
 * Displays the products list for the currently active store.
 */
export default function MerchantProductsPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('nav');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('products')}</h1>
        </div>
        <WorkspaceEmptyState 
          title="No active store"
          message="Select a store from the switcher to view its products."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 
        ProductsContent already includes a header with "Add product" button, 
        so we don't need an additional header here.
      */}
      <ProductsContent storeId={String(activeStore.id)} initialFilters={INITIAL_FILTERS} />
    </div>
  );
}
