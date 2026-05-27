import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { ROUTES } from '@/config/routes';

/**
 * /merchant root page.
 * Redirects to the merchant dashboard.
 */
export default async function MerchantPage() {
  const locale = await getLocale();
  
  // Hard redirect from root /merchant to /merchant/dashboard
  redirect(`/${locale}${ROUTES.merchant.dashboard()}`);
}
