import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

export default async function UsersPage({
  params,
}: {
  params: Promise<{ storeId: string; locale: string }>;
}) {
  const { storeId } = await params;

  return (
    <LegacyRouteRedirector 
      storeId={storeId} 
      targetPath={ROUTES.merchant.customers()} 
      originalRoute={`/stores/${storeId}/users`}
    />
  );
}
