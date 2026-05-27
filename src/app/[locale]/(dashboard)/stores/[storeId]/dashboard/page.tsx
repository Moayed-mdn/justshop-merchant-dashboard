/**
 * Dashboard page.
 * Thin wrapper with Suspense boundary for streaming.
 */

import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

interface DashboardPageProps {
  params: Promise<{ storeId: string; locale: string }>;
}

/**
 * Dashboard page component (Legacy Redirector).
 */
export default async function DashboardPage({ params }: DashboardPageProps) {
  const { storeId } = await params;

  return (
    <LegacyRouteRedirector 
      storeId={storeId} 
      targetPath={ROUTES.merchant.dashboard()} 
      originalRoute={`/stores/${storeId}/dashboard`}
    />
  );
}
