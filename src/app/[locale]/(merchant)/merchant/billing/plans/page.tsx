/**
 * Plan Selection Page
 * Browse and select subscription plans
 */

import { getTranslations } from 'next-intl/server';
import { PlansPageClient } from './PlansPageClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'billing.plans' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function PlansPage() {
  return <PlansPageClient />;
}
