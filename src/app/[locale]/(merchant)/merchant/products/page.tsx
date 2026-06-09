'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { MerchantPageHeader } from '@/features/merchant/components/MerchantPageHeader';
import ProductsContent from '@/features/dashboard/products/ProductsContent';
import { useTranslations } from 'next-intl';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';

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
        <MerchantPageHeader
          title={t('products')}
          description="View and manage your products."
        />
        <WorkspaceEmptyState 
          icon={Package}
          title="No active store"
          message="Select a store from the switcher to view and manage its products."
        />
      </div>
    );
  }

  const pt = useTranslations('products');

  return (
    <div className="space-y-6">
      <MerchantPageHeader
        title={t('products')}
        description="View and manage your products."
      >
        <Link href={ROUTES.merchant.products.new()}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {pt('new')}
          </Button>
        </Link>
      </MerchantPageHeader>
      <ProductsContent storeId={String(activeStore.id)} initialFilters={INITIAL_FILTERS} />
    </div>
  );
}
