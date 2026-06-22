'use client';

/**
 * Marketing pages list content component.
 * Manages filter and pagination state via URL (nuqs).
 */

import { useQueryState, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs';
import { useTranslations } from 'next-intl';
import { PlusCircle } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import { useMarketingPages } from '@/hooks/marketing-pages/useMarketingPages';
import { MarketingPagesTable } from './MarketingPagesTable';
import type { MarketingPageFilters } from '@/schemas/marketing-pages';

interface Props {
  storeId:        string;
  initialFilters: MarketingPageFilters;
}

const STATUS_OPTIONS  = ['all', 'draft', 'published', 'scheduled'] as const;
const TEMPLATE_OPTIONS = ['all', 'landing', 'campaign', 'promotion', 'generic'] as const;

export default function MarketingPagesContent({ storeId, initialFilters }: Props) {
  const t = useTranslations('cmsPages');

  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(initialFilters.search),
  );

  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringLiteral(STATUS_OPTIONS).withDefault(
      initialFilters.status as (typeof STATUS_OPTIONS)[number],
    ),
  );

  const [template, setTemplate] = useQueryState(
    'template',
    parseAsStringLiteral(TEMPLATE_OPTIONS).withDefault(
      initialFilters.template as (typeof TEMPLATE_OPTIONS)[number],
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

  const filters: MarketingPageFilters = { search, status, template, page, perPage };

  const { data, isLoading, error } = useMarketingPages(storeId, filters);

  if (error) {
    logger.error('Failed to load marketing pages', error);
  }

  const handleStatusChange = (value: typeof status) => {
    setStatus(value);
    if (page !== 1) setPage(1);
  };

  const handleTemplateChange = (value: typeof template) => {
    setTemplate(value);
    if (page !== 1) setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (page !== 1) setPage(1);
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
          href={ROUTES.merchant.cmsPages() + '/create'}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <PlusCircle className="h-4 w-4" />
          {t('new')}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t('filters.searchPlaceholder')}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-[220px]"
        />

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as typeof status)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">{t('filters.allStatuses')}</option>
          {(['draft', 'published', 'scheduled'] as const).map((s) => (
            <option key={s} value={s}>{t(`status.${s}`)}</option>
          ))}
        </select>

        {/* Template filter */}
        <select
          value={template}
          onChange={(e) => handleTemplateChange(e.target.value as typeof template)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">{t('filters.allTemplates')}</option>
          {(['landing', 'campaign', 'promotion', 'generic'] as const).map((tpl) => (
            <option key={tpl} value={tpl}>{t(`templates.${tpl}`)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <MarketingPagesTable
        pages={data?.data ?? []}
        pagination={data?.meta.pagination}
        page={page}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
        isLoading={isLoading}
      />
    </div>
  );
}
