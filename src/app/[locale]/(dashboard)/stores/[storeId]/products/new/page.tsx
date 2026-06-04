/**
 * New product page (Legacy Redirector).
 */

import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

export async function generateMetadata() {
  return {
    title: 'New Product',
  };
}

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ storeId: string; locale: string }>;
}) {
  const { storeId } = await params;

  return (
    <LegacyRouteRedirector 
      storeId={storeId} 
      targetPath="/merchant/products/new" 
      originalRoute={`/stores/${storeId}/products/new`}
    />
  );
}
