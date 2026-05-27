/**
 * Products list page.
 * Server component with Suspense boundary.
 */

import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ storeId: string; locale: string }>;
}) {
  const { storeId } = await params;

  return (
    <LegacyRouteRedirector 
      storeId={storeId} 
      targetPath={ROUTES.merchant.products()} 
      originalRoute={`/stores/${storeId}/products`}
    />
  );
}
