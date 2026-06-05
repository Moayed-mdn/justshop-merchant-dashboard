'use client';

/**
 * Hero Banners list page content (client component).
 * Manages filter state and displays hero banners table.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getHeroBanners, deleteHeroBanner, restoreHeroBanner } from '@/lib/api/hero-banners';
import HeroBannersTable from './HeroBannersTable';
import HeroBannerFilters from './HeroBannerFilters';

interface Props {
  storeId: string;
}

type StatusFilter = 'all' | 'active' | 'inactive' | 'trashed';

export default function HeroBannersContent({ storeId }: Props) {
  const t = useTranslations('heroBanners');

  const queryClient = useQueryClient();
  const [status, setStatus]   = useState<StatusFilter>('all');
  const [search, setSearch]   = useState('');

  const { data: banners = [], isLoading, error } = useQuery({
    queryKey: ['hero-banners', storeId, status, search],
    queryFn:  () => getHeroBanners(storeId, { status, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: (bannerId: string) => deleteHeroBanner(storeId, bannerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-banners', storeId] });
      toast.success(t('table.deleteSuccess'));
    },
    onError: (err: any) => {
      logger.error('Failed to delete hero banner', { error: err });
      toast.error(err?.message || t('table.deleteError'));
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (bannerId: string) => restoreHeroBanner(storeId, bannerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-banners', storeId] });
      toast.success(t('table.restoreSuccess'));
    },
    onError: (err: any) => {
      logger.error('Failed to restore hero banner', { error: err });
      toast.error(err?.message || t('table.restoreError'));
    },
  });

  if (error) {
    logger.error('Failed to load hero banners', { error });
  }

  const handleDelete = (bannerId: string) => {
    if (confirm(t('table.deleteConfirm'))) {
      deleteMutation.mutate(bannerId);
    }
  };

  const handleRestore = (bannerId: string) => {
    restoreMutation.mutate(bannerId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Link
          href={ROUTES.merchant.heroBanners.new()}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground h-8 gap-1.5 px-2.5 text-sm font-medium transition-all hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          {t('new')}
        </Link>
      </div>

      {/* Filters */}
      <HeroBannerFilters
        status={status}
        search={search}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
      />

      {/* Table */}
      <HeroBannersTable
        banners={banners}
        isLoading={isLoading}
        storeId={storeId}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />
    </div>
  );
}
