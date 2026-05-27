import { headers } from 'next/headers';
import { DashboardShell } from '@/features/dashboard/shell/DashboardShell';
import { TenantInitializer } from '@/features/dashboard/shell/TenantInitializer';
import { LegacyLayoutRedirector } from '@/features/merchant/components/LegacyLayoutRedirector';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; storeId: string }>;
}

/**
 * Legacy Store Layout (Redirect Shell).
 * Captures all /stores/[id]/* routes and redirects them to the canonical /merchant/* workspace.
 */
export default async function DashboardLayout({ params }: DashboardLayoutProps) {
  const { storeId } = await params;
  const headerList = await headers();
  const tenantSlug = headerList.get('x-tenant-slug');

  return (
    <>
      <TenantInitializer tenantSlug={tenantSlug} />
      <DashboardShell>
        <LegacyLayoutRedirector storeId={storeId} />
      </DashboardShell>
    </>
  );
}
