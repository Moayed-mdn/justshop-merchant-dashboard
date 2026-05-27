'use client';

import { useParams } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import EditMarketingPageForm from '@/features/dashboard/cms-pages/EditMarketingPageForm';
import { useMarketingPage } from '@/hooks/marketing-pages/useMarketingPage';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Merchant Workspace — Edit Marketing Page.
 */
export default function MerchantCmsPagesEditPage() {
  const params      = useParams<{ id: string }>();
  const pageId      = params.id;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t           = useTranslations('cmsPages');

  const storeId = activeStore ? String(activeStore.id) : '';

  const { data: page, isLoading, error } = useMarketingPage(storeId, pageId);

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.editTitle')}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to edit a marketing page."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t('detail.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditMarketingPageForm
        storeId={storeId}
        pageId={pageId}
        page={page}
      />
    </div>
  );
}
