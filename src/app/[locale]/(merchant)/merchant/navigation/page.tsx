'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import NavigationMenusContent from '@/features/theme/navigation/NavigationMenusContent';
import { useTranslations } from 'next-intl';

const INITIAL_FILTERS = {
  page: 1,
  perPage: 15,
};

/**
 * Merchant Workspace Navigation Menus Page.
 * Displays the navigation menus list for the currently active store.
 */
export default function MerchantNavigationMenusPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('theme.navigation');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <WorkspaceEmptyState 
          title="No active store"
          message="Select a store from the switcher to view navigation menus."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NavigationMenusContent 
        storeId={String(activeStore.id)} 
        initialFilters={INITIAL_FILTERS} 
      />
    </div>
  );
}
