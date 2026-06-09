'use client';

import { useQueryState, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs';
import { useTags } from '@/hooks/tags/useTags';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTag } from '@/lib/api/tags';
import { queryKeys } from '@/lib/queryKeys';
import TagsTable from './TagsTable';
import TagFilters from './TagFilters';
import type { TagFilters as TagFiltersType } from '@/schemas/tags';

interface Props {
  storeId:        string;
  initialFilters: TagFiltersType;
}

const STATUS_OPTIONS = ['all', 'true', 'false'] as const;

export default function TagsContent({ storeId, initialFilters }: Props) {
  const t = useTranslations('tags');

  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(initialFilters.search),
  );
  const [isActive, setIsActive] = useQueryState(
    'is_active',
    parseAsStringLiteral(STATUS_OPTIONS).withDefault(
      initialFilters.is_active as (typeof STATUS_OPTIONS)[number],
    ),
  );
  const [page, setPage]       = useQueryState('page',    parseAsInteger.withDefault(initialFilters.page));
  const [perPage, setPerPage] = useQueryState('perPage', parseAsInteger.withDefault(initialFilters.perPage));

  const filters: TagFiltersType = {
    search,
    type:      '',
    is_active: isActive,
    page,
    perPage,
  };

  const { data, isLoading, error } = useTags(storeId, filters);
  const queryClient = useQueryClient();

  if (error) logger.error('Failed to load tags', { error });

  const deleteMutation = useMutation({
    mutationFn: (tagId: string) => deleteTag(storeId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags(storeId).lists() });
      toast.success(t('form.deleteSuccess'));
    },
    onError: (err: any) => {
      logger.error('Failed to delete tag', { error: err });
      toast.error(err?.message ?? t('form.deleteError'));
    },
  });

  const handleDelete = (tagId: string) => {
    if (confirm(t('table.deleteConfirm'))) deleteMutation.mutate(tagId);
  };

  const handleIsActiveChange = (value: 'all' | 'true' | 'false') => {
    setIsActive(value);
    if (page !== 1) setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (page !== 1) setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Link
          href={ROUTES.merchant.tags.new()}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground h-8 gap-1.5 px-2.5 text-sm font-medium transition-all hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          {t('new')}
        </Link>
      </div>

      <TagFilters
        search={search}
        onSearchChange={handleSearchChange}
        isActive={isActive}
        onIsActiveChange={handleIsActiveChange}
      />

      <TagsTable
        tags={data?.data ?? []}
        pagination={data?.meta.pagination}
        page={page}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
        isLoading={isLoading}
        storeId={storeId}
        onDelete={handleDelete}
      />
    </div>
  );
}