'use client';

/**
 * Subscription filters component.
 * Client component for search and filter controls.
 */

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { makeLabelByValue, renderSelectValue, type SelectOption } from '@/lib/selectOptions';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string | null) => void;
}

export default function SubscriptionFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  const t = useTranslations('subscriptions');

  const statusOptions = [
    { value: 'all', label: t('filters.allStatuses') },
    { value: 'incomplete', label: t('status.incomplete') },
    { value: 'trialing', label: t('status.trialing') },
    { value: 'active', label: t('status.active') },
    { value: 'past_due', label: t('status.pastDue') },
    { value: 'grace_period', label: t('status.gracePeriod') },
    { value: 'paused', label: t('status.paused') },
    { value: 'canceled', label: t('status.canceled') },
    { value: 'expired', label: t('status.expired') },
  ] as const satisfies readonly SelectOption<string>[];

  const statusLabelByValue = makeLabelByValue(statusOptions);

  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('filters.searchPlaceholder')}
          aria-label={t('filters.search')}
          className="pl-9"
        />
      </div>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]" aria-label={t('filters.status')}>
          <SelectValue>
            {renderSelectValue(statusLabelByValue, t('filters.status'))}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
