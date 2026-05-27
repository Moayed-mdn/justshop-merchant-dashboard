'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import type { MarketingPageListItemView } from '@/types/marketing-page';
import type { PaginationMeta } from '@/types/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MarketingPageStatusBadge } from './components/MarketingPageStatusBadge';
import { makeLabelByValue, renderSelectValue, type SelectOption } from '@/lib/selectOptions';

interface Props {
  pages:           MarketingPageListItemView[];
  pagination:      PaginationMeta | undefined;
  page:            number;
  onPageChange:    (page: number) => void;
  perPage:         number;
  onPerPageChange: (perPage: number) => void;
  isLoading:       boolean;
}

export function MarketingPagesTable({
  pages,
  pagination,
  page,
  onPageChange,
  perPage,
  onPerPageChange,
  isLoading,
}: Props) {
  const t = useTranslations('cmsPages');

  const perPageOptions = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
  ] as const satisfies readonly SelectOption<string>[];

  const perPageLabelByValue = makeLabelByValue(perPageOptions);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t('table.empty')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.title')}</TableHead>
              <TableHead>{t('table.template')}</TableHead>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead>{t('table.sortOrder')}</TableHead>
              <TableHead>{t('table.publishedAt')}</TableHead>
              <TableHead>{t('table.created')}</TableHead>
              <TableHead className="text-right">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {p.displayTitle}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">
                    {t(`templates.${p.template}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <MarketingPageStatusBadge status={p.status} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {p.sortOrder}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {p.publishedAt ?? '—'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {p.createdAt}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`${ROUTES.merchant.cmsPages()}/${p.id}/edit`}
                    className="inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-transparent bg-clip-padding h-7 gap-1 px-2.5 text-[0.8rem] hover:bg-muted hover:text-foreground"
                  >
                    {t('table.edit')}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {pagination.from ?? 0} – {pagination.to ?? 0} {t('table.of')} {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <Select
              value={String(perPage)}
              onValueChange={(v) => onPerPageChange(Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue>
                  {renderSelectValue(perPageLabelByValue, t('table.perPage'))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
              >
                {t('table.previous')}
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {t('table.page', { current: page, total: pagination.total_pages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= pagination.total_pages}
              >
                {t('table.next')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
