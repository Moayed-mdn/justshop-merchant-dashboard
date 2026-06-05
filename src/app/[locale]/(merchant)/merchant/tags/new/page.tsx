'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import CreateTagForm from '@/features/dashboard/tags/CreateTagForm';
import { useTranslations } from 'next-intl';

/**
 * Merchant Workspace — Create Tag Page.
 * Canonical route: /merchant/tags/new
 * 
 * This is the workspace-level tag creation page that uses the active store
 * from the merchant's context. For direct store-scoped access, use the route:
 * /stores/[storeId]/tags/new
 */
export default function MerchantTagCreatePage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('tags');

  const storeId = activeStore ? String(activeStore.id) : '';

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.createTitle', { default: 'Create Tag' })}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to create a tag."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateTagForm storeId={storeId} />
    </div>
  );
}
