/**
 * Orders list page (RSC).
 * Thin wrapper with Suspense boundary.
 */

import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

interface PageProps {
  params: Promise<{ storeId: string; locale: string }>;
}

export default async function OrdersPage({ params }: PageProps) {
  const { storeId } = await params;

  return (
    <LegacyRouteRedirector 
      storeId={storeId} 
      targetPath={ROUTES.merchant.orders.list()} 
      originalRoute={`/stores/${storeId}/orders`}
    />
  );
}
