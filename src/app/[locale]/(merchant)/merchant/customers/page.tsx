'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import UsersContent from '@/features/dashboard/users/UsersContent';
import { useTranslations } from 'next-intl';

const INITIAL_FILTERS = {
  search: '',
  role: 'all' as const,
  status: 'all' as const,
  page: 1,
  perPage: 10,
};

/**
 * Merchant Workspace Customers Page.
 * Displays the customers (users) list for the currently active store.
 */
export default function MerchantCustomersPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('nav');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('users')}</h1>
        </div>
        <WorkspaceEmptyState 
          title="No active store"
          message="Select a store from the switcher to view its customers."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsersContent storeId={String(activeStore.id)} initialFilters={INITIAL_FILTERS} />
    </div>
  );
}
