/**
 * Invoices Page Client Component
 * Invoice list with filters and pagination
 */

'use client';

import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useInvoices } from '@/hooks/billing/useInvoices';
import { InvoiceTable } from '@/components/billing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useTranslations } from 'next-intl';
import type { InvoiceStatus } from '@/types/billing/invoice';

export function InvoicesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  
  const t = useTranslations('billing.invoices');
  const tBilling = useTranslations('billing');

  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') as InvoiceStatus | undefined;
  const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined;

  const { data: invoiceData, isLoading } = useInvoices({
    page,
    per_page: 10,
    status,
    year,
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete('page'); // Reset to page 1
    router.push(`?${params.toString()}`);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${locale}/merchant/billing`)}
          aria-label={tBilling('backToBilling') || 'Back to billing'}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={status || 'all'}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {status === 'paid' ? t('filters.paid') :
               status === 'open' ? t('filters.open') :
               status === 'draft' ? t('filters.draft') :
               status === 'void' ? t('filters.void') :
               status === 'uncollectible' ? t('filters.uncollectible') :
               t('filters.allStatuses')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
            <SelectItem value="paid">{t('filters.paid')}</SelectItem>
            <SelectItem value="open">{t('filters.open')}</SelectItem>
            <SelectItem value="draft">{t('filters.draft')}</SelectItem>
            <SelectItem value="void">{t('filters.void')}</SelectItem>
            <SelectItem value="uncollectible">{t('filters.uncollectible')}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={year?.toString() || 'all'}
          onValueChange={(value) => handleFilterChange('year', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {year ? year : t('filters.allYears')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.allYears')}</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Invoice Table */}
      {invoiceData && (
        <InvoiceTable
          invoices={invoiceData.data}
          currentPage={invoiceData.meta.pagination.current_page}
          totalPages={invoiceData.meta.pagination.total_pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
