import { headers } from 'next/headers';
import { DashboardShell } from '@/features/dashboard/shell/DashboardShell';
import { TenantInitializer } from '@/features/dashboard/shell/TenantInitializer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; storeId: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  await params;
  const headerList = await headers();
  const tenantSlug = headerList.get('x-tenant-slug');

  return (
    <>
      <TenantInitializer tenantSlug={tenantSlug} />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
