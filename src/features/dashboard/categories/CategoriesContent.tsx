'use client';
// Reason: needs nuqs state sync and interactive filters

/**
 * Categories list page content (client component).
 * Manages filter and pagination state via URL (nuqs).
 */

import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { parseAsStringLiteral } from 'nuqs';
import { useCategories } from '@/hooks/categories/useCategories';
import { useTranslations } from 'next-intl';

import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory, restoreCategory } from '@/lib/api/categories';
import { queryKeys } from '@/lib/queryKeys';
import CategoriesTable from './CategoriesTable';
import CategoryFilters from './CategoryFilters';
import type { CategoryFilters as CategoryFiltersType } from '@/schemas/categories';

interface Props {
  storeSlug:        string;
  initialFilters: CategoryFiltersType;
}

const STATUS_OPTIONS = ['all', 'true', 'false'] as const;

export default function CategoriesContent({ storeSlug, initialFilters }: Props) {
  const t = useTranslations('categories');

  const [isActive, setIsActive] = useQueryState(
    'is_active',
    parseAsStringLiteral(STATUS_OPTIONS).withDefault(
      initialFilters.is_active as (typeof STATUS_OPTIONS)[number],
    ),
  );

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(initialFilters.page),
  );

  const [perPage, setPerPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(initialFilters.perPage),
  );

  const filters: CategoryFiltersType = { is_active: isActive, page, perPage };

  const { data, isLoading, error } = useCategories(storeSlug, filters);
  const queryClient = useQueryClient();

  if (error) {
    logger.error('Failed to load categories', error);
  }

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(storeSlug, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories(storeSlug).lists() });
      toast.success(t('form.deleteSuccess'));
    },
    onError: (err: any) => {
      logger.error('Failed to delete category', { error: err });
      toast.error(err?.message ?? t('form.deleteError'));
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (categoryId: string) => restoreCategory(storeSlug, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories(storeSlug).lists() });
      toast.success(t('form.restoreSuccess'));
    },
    onError: (err: any) => {
      logger.error('Failed to restore category', { error: err });
      toast.error(err?.message ?? t('form.restoreError'));
    },
  });

  const handleDelete = (categoryId: string) => {
    if (confirm(t('table.deleteConfirm'))) deleteMutation.mutate(categoryId);
  };

  const handleRestore = (categoryId: string) => {
    restoreMutation.mutate(categoryId);
  };

  const handleIsActiveChange = (value: 'all' | 'true' | 'false') => {
    setIsActive(value);
    if (page !== 1) setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <CategoryFilters
        isActive={isActive}
        onIsActiveChange={handleIsActiveChange}
      />

      {/* Table */}
      <CategoriesTable
        categories={data?.data ?? []}
        pagination={data?.meta.pagination}
        page={page}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
        isLoading={isLoading}
        storeSlug={storeSlug}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />
    </div>
  );
}