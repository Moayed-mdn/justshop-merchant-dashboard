/**
 * Subscription invoices table.
 * Shows invoice history with status badges and hosted invoice links.
 */

import { useTranslations } from 'next-intl';
import type { SubscriptionDetailView } from '@/types/billing/subscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props {
  subscription: SubscriptionDetailView;
}

export function SubscriptionInvoices({ subscription }: Props) {
  const t = useTranslations('subscriptions.detail.invoices');

  const getInvoiceStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'open':
        return 'secondary';
      case 'void':
      case 'uncollectible':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {subscription.invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t('empty')}</p>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('number')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead className="text-right">{t('amount')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscription.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getInvoiceStatusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-0.5">
                        <div className="font-medium">{invoice.totalFormatted}</div>
                        {invoice.amountDueFormatted !== invoice.totalFormatted && (
                          <div className="text-xs text-muted-foreground">
                            {t('due')}: {invoice.amountDueFormatted}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="space-y-0.5">
                        <div>{invoice.issuedAtFormatted || '—'}</div>
                        {invoice.paidAtFormatted && (
                          <div className="text-xs text-muted-foreground">
                            {t('paid')}: {invoice.paidAtFormatted}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {invoice.hostedInvoiceUrl && (
                        <a
                          href={invoice.hostedInvoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
