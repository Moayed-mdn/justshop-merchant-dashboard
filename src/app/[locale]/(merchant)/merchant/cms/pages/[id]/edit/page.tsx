'use client';

import { useParams } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import EditMarketingPageForm from '@/features/dashboard/cms-pages/EditMarketingPageForm';
import { useMarketingPage } from '@/hooks/marketing-pages/useMarketingPage';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { getStoreRouteParam } from '@/lib/stores/route-param';

/**
 * Merchant Workspace — Edit Marketing Page.
 */
export default function MerchantCmsPagesEditPage() {
  const params      = useParams<{ id: string }>();
  const pageId      = params.id;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t           = useTranslations('cmsPages');

  const storeSlug = getStoreRouteParam(activeStore);

  const { data: page, isLoading, error } = useMarketingPage(storeSlug, pageId);

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.editTitle')}</h1>
        </div>
        <WorkspaceEmptyState />
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
        storeSlug={storeSlug}
        pageId={pageId}
        page={page}
      />
    </div>
  );
}
