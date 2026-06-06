'use client';

/**
 * Navigation Menus list page content (client component).
 * Manages pagination state via URL (nuqs).
 */

import { useQueryState, parseAsInteger } from 'nuqs';
import { useNavigationMenus } from '@/hooks/navigation/useNavigationMenus';
import { useDeleteNavigationMenu } from '@/hooks/navigation/useNavigationMenuMutations';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import NavigationMenusTable from './NavigationMenusTable';
import CreateNavigationMenuDialog from './CreateNavigationMenuDialog';
import type { NavigationMenuFilters } from '@/types/navigation';

interface Props {
  storeId: string;
  initialFilters: NavigationMenuFilters;
}

export default function NavigationMenusContent({ storeId, initialFilters }: Props) {
  const t = useTranslations('theme.navigation');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(initialFilters.page),
  );

  const [perPage, setPerPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(initialFilters.perPage),
  );

  const filters: NavigationMenuFilters = { page, perPage };

  const { data, isLoading, error } = useNavigationMenus(storeId, filters);
  const deleteMutation = useDeleteNavigationMenu(storeId);

  if (error) {
    logger.error('Failed to load navigation menus', { error });
  }

  const handleDelete = (menuId: string) => {
    if (confirm(t('deleteConfirm'))) {
      deleteMutation.mutate(menuId, {
        onSuccess: () => {
          toast.success(t('deleteSuccess'));
        },
        onError: (err: any) => {
          logger.error('Failed to delete navigation menu', { error: err });
          toast.error(err?.message ?? t('deleteError'));
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          {t('createMenu')}
        </Button>
      </div>

      {/* Table */}
      <NavigationMenusTable
        menus={data?.data ?? []}
        pagination={data?.meta.pagination}
        page={page}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
        isLoading={isLoading}
        storeId={storeId}
        onDelete={handleDelete}
      />

      {/* Create Dialog */}
      <CreateNavigationMenuDialog
        storeId={storeId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
