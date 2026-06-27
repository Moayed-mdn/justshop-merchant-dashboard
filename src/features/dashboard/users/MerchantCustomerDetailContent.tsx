'use client';

import { useParams } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { useUserDetail } from '@/hooks/users/useUserDetail';
import { useTranslations } from 'next-intl';
import { UserDetailSkeleton } from '@/features/dashboard/users/UserDetailSkeleton';
import UserDetailCard from '@/features/dashboard/users/UserDetailCard';

/**
 * Merchant Workspace — Customer Detail Content (Client Component).
 * Handles interactivity, hooks, state, etc.
 */
export default function MerchantCustomerDetailContent() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('users');

  const storeId = activeStore ? String(activeStore.id) : '';

  const { data: user, isLoading, error } = useUserDetail(storeId, userId);

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('detail.title')}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to view customer details."
        />
      </div>
    );
  }

  if (isLoading) {
    return <UserDetailSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
        <p className="text-destructive">{t('detail.error')}</p>
      </div>
    );
  }

  return <UserDetailCard user={user} storeId={storeId} />;
}
