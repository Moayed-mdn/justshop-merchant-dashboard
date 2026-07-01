'use client';

import { useParams } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { useCategoryDetail } from '@/hooks/categories/useCategoryDetail';
import { useTranslations } from 'next-intl';
import { EditCategorySkeleton } from '@/features/dashboard/categories/EditCategorySkeleton';
import EditCategoryContent from '@/features/dashboard/categories/EditCategoryContent';
import { getStoreRouteParam } from '@/lib/stores/route-param';

/**
 * Merchant Workspace — Edit Category Page.
 * Canonical route: /merchant/categories/[id]/edit
 */
export default function MerchantCategoryEditPage() {
  const params = useParams<{ id: string }>();
  const categoryId = params.id;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('categories');

  const storeSlug = getStoreRouteParam(activeStore);

  const { data: category, isLoading, error } = useCategoryDetail(storeSlug, categoryId);

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
    return <EditCategorySkeleton />;
  }

  if (error || !category) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
        <p className="text-destructive">{t('detail.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditCategoryContent storeSlug={storeSlug} categoryId={categoryId} />
    </div>
  );
}
