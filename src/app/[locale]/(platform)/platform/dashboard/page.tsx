/**
 * Platform dashboard page.
 */

import { Suspense } from 'react';
import PlatformDashboardContent from '@/features/platform/dashboard/PlatformDashboardContent';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('platformDashboard');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function PlatformDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PlatformDashboardContent />
    </Suspense>
  );
}
