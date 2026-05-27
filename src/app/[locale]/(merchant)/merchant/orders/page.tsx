'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import OrdersContent from '@/features/dashboard/orders/OrdersContent';
import { useTranslations } from 'next-intl';

const INITIAL_FILTERS = {
  search: '',
  status: 'all' as const,
  payment_status: 'all' as const,
  page: 1,
  perPage: 10,
};

/**
 * Merchant Workspace Orders Page.
 * Displays the orders list for the currently active store.
 */
export default function MerchantOrdersPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('nav');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('orders')}</h1>
        </div>
        <WorkspaceEmptyState 
          title="No active store"
          message="Select a store from the switcher to view its orders."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('orders')}</h1>
      </div>
      <OrdersContent storeId={String(activeStore.id)} initialFilters={INITIAL_FILTERS} />
    </div>
  );
}
