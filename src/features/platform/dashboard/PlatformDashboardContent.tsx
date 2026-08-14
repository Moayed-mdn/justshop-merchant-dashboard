'use client';

/**
 * Platform Dashboard content component (client component for data fetching).
 * Shows platform-level stats split into Store Activity and Platform Revenue sections.
 */

import { usePlatformDashboard } from '@/hooks/platform/usePlatformDashboard';
import { mapPlatformDashboardStats } from '@/lib/mappers/platform-dashboard';
import { useTranslations } from 'next-intl';
import { logger } from '@/lib/logger';
import { StoreActivitySection } from './StoreActivitySection';
import { PlatformRevenueSection } from './PlatformRevenueSection';

export default function PlatformDashboardContent() {
  const t = useTranslations('platformDashboard');
  const { data, isLoading, error } = usePlatformDashboard();

  if (error) {
    logger.error('[PlatformDashboardContent] Failed to fetch dashboard data', error);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('subtitle')}</p>
        </div>
        <div className="rounded-md bg-destructive/10 p-4">
          <p className="text-destructive text-sm">{t('error')}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('subtitle')}</p>
        </div>
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const stats = mapPlatformDashboardStats(data);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('subtitle')}</p>
      </div>

      <StoreActivitySection stats={stats} />
      <PlatformRevenueSection stats={stats} />
    </div>
  );
}
