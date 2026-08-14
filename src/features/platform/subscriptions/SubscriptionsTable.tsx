'use client';

/**
 * Subscriptions table with pagination.
 * Client component for interactive pagination controls.
 */

import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/config/routes';
import type { SubscriptionListItemView } from '@/types/billing/subscription';
import type { PaginationMeta } from '@/types/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { makeLabelByValue, renderSelectValue, type SelectOption } from '@/lib/selectOptions';
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge';

interface Props {
  subscriptions: SubscriptionListItemView[];
  pagination: PaginationMeta | undefined;
  page: number;
  onPageChange: (page: number) => void;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  isLoading: boolean;
}

export default function SubscriptionsTable({
  subscriptions,
  pagination,
  page,
  onPageChange,
  perPage,
  onPerPageChange,
  isLoading,
}: Props) {
  const t = useTranslations('subscriptions');

  const perPageOptions = [
    { value: '10', label: '10' },
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

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <span className="text-2xl">💳</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold">{t('table.empty')}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
          {t('table.emptyMessage')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead>{t('table.plan')}</TableHead>
              <TableHead>{t('table.price')}</TableHead>
              <TableHead>{t('table.merchant')}</TableHead>
              <TableHead>{t('table.periodEnd')}</TableHead>
              <TableHead>{t('table.created')}</TableHead>
              <TableHead className="text-right">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <SubscriptionStatusBadge status={subscription.status} />
                    {subscription.cancelAtPeriodEnd && (
                      <Badge variant="outline" className="text-xs">
                        {t('table.ending')}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{subscription.planName}</div>
                  <div className="text-xs text-muted-foreground">{subscription.planCode}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {subscription.priceFormatted}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{subscription.merchantName}</div>
                  <div className="text-xs text-muted-foreground">{subscription.merchantEmail}</div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {subscription.currentPeriodEndsAtRelative || '—'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {subscription.createdAtRelative}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={ROUTES.platform.billing.subscriptions.detail(subscription.id)}
                    className="group/button inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-transparent bg-clip-padding h-7 gap-1 px-2.5 text-[0.8rem] hover:bg-muted hover:text-foreground"
                  >
                    {t('table.view')}
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
            {pagination.from ?? 0} - {pagination.to ?? 0} {t('table.of')} {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <Select value={String(perPage)} onValueChange={(v) => onPerPageChange(Number(v))}>
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
              <span className="text-sm text-muted-foreground">
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
