'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import TagsContent from '@/features/dashboard/tags/TagsContent';
import { useTranslations } from 'next-intl';

const INITIAL_FILTERS = {
  search: '',
  type: '',
  is_active: 'all' as const,
  page: 1,
  perPage: 15,
};

/**
 * Merchant Workspace Tags Page.
 * Displays the tags list for the currently active store.
 */
export default function MerchantTagsPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('nav');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('tags')}</h1>
        </div>
        <WorkspaceEmptyState 
          title="No active store"
          message="Select a store from the switcher to view its tags."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TagsContent storeId={String(activeStore.id)} initialFilters={INITIAL_FILTERS} />
    </div>
  );
}
