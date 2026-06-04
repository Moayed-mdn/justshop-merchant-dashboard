/**
 * Edit product page (Legacy Redirector).
 */

import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return {
    title: `Product #${productId}`,
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ storeId: string; productId: string; locale: string }>;
}) {
  const { storeId, productId } = await params;

  return (
    <LegacyRouteRedirector 
      storeId={storeId} 
      targetPath={`/merchant/products/${productId}/edit`}
      originalRoute={`/stores/${storeId}/products/${productId}`}
    />
  );
}
