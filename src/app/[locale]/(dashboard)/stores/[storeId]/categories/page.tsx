import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ storeId: string; locale: string }>;
}) {
  const { storeId } = await params;

  return (
    <LegacyRouteRedirector 
      storeId={storeId} 
      targetPath={ROUTES.merchant.categories.list()} 
      originalRoute={`/stores/${storeId}/categories`}
    />
  );
}
