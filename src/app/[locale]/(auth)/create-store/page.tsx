/**
 * Legacy route — redirects to the canonical /setup route.
 * Kept for bookmark and link compatibility.
 */
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function CreateStoreRedirectPage() {
  const locale = await getLocale();
  redirect(`/${locale}/setup`);
}
