/**
 * Brands list page.
 * Server component — thin wrapper with Suspense boundary.
 */

import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ storeId: string; locale: string }>;
}) {
  const { storeId } = await params;

  return (
    <LegacyRouteRedirector 
      storeId={storeId} 
      targetPath={ROUTES.merchant.brands.list()} 
      originalRoute={`/stores/${storeId}/brands`}
    />
  );
}
