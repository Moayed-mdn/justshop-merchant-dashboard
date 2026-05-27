'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import CreateMarketingPageForm from '@/features/dashboard/cms-pages/CreateMarketingPageForm';
import { useTranslations } from 'next-intl';

/**
 * Merchant Workspace — Create Marketing Page.
 */
export default function MerchantCmsPagesCreatePage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t           = useTranslations('cmsPages');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.createTitle')}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to create a marketing page."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateMarketingPageForm storeId={String(activeStore.id)} />
    </div>
  );
}
