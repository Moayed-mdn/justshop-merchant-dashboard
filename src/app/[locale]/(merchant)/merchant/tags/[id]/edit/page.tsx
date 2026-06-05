'use client';

import { useParams } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { useTagDetail } from '@/hooks/tags/useTagDetail';
import { useTranslations } from 'next-intl';
import { EditTagSkeleton } from '@/features/dashboard/tags/EditTagSkeleton';
import EditTagContent from '@/features/dashboard/tags/EditTagContent';

/**
 * Merchant Workspace — Edit Tag Page.
 * Canonical route: /merchant/tags/[id]/edit
 */
export default function MerchantTagEditPage() {
  const params = useParams<{ id: string }>();
  const tagId = params.id;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('tags');

  const storeId = activeStore ? String(activeStore.id) : '';

  const { data: tag, isLoading, error } = useTagDetail(storeId, tagId);

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.editTitle')}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to edit a tag."
        />
      </div>
    );
  }

  if (isLoading) {
    return <EditTagSkeleton />;
  }

  if (error || !tag) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
        <p className="text-destructive">{t('detail.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditTagContent storeId={storeId} tagId={tagId} />
    </div>
  );
}
