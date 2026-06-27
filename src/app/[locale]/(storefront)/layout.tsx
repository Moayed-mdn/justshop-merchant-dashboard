import { StorefrontLayout } from '@/features/storefront/StorefrontLayout';

export default function StorefrontRootLayout({ children }: { children: React.ReactNode }) {
  return <StorefrontLayout>{children}</StorefrontLayout>;
}
