'use client';

import { useParams } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { useOrderDetail } from '@/hooks/orders/useOrderDetail';
import { useTranslations } from 'next-intl';
import { OrderDetailSkeleton } from '@/features/dashboard/orders/OrderDetailSkeleton';
import OrderDetailCard from '@/features/dashboard/orders/OrderDetailCard';
import OrderLineItemsTable from '@/features/dashboard/orders/OrderLineItemsTable';
import OrderStatusSelect from '@/features/dashboard/orders/OrderStatusSelect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Merchant Workspace — Order Detail Page.
 * Canonical route: /merchant/orders/[id]
 */
export default function MerchantOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('orders');

  const storeId = activeStore ? String(activeStore.id) : '';

  const { data: order, isLoading, error } = useOrderDetail(storeId, orderId);

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('detail.title')}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to view order details."
        />
      </div>
    );
  }

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
        <p className="text-destructive">{t('detail.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('detail.title')}</h1>
      </div>

      <OrderDetailCard order={order} storeId={storeId} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderLineItemsTable items={order.items} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('detail.status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusSelect
                storeId={storeId}
                orderId={order.id}
                currentStatus={order.status}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
