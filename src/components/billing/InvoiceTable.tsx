/**
 * Invoice Table (Client Component for pagination)
 * Displays invoice list with filtering and pagination
 */

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download } from 'lucide-react';
import Link from 'next/link';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import type { Invoice } from '@/types/billing/invoice';

interface InvoiceTableProps {
  invoices: Invoice[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function InvoiceTable({
  invoices,
  currentPage,
  totalPages,
  onPageChange,
}: InvoiceTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amountCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  };

  if (invoices.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No invoices found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead className="text-end">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  {invoice.issued_at
                    ? formatDate(invoice.issued_at)
                    : formatDate(invoice.created_at)}
                </TableCell>
                <TableCell>
                  <code className="text-sm">
                    {invoice.invoice_number || `#${invoice.id}`}
                  </code>
                </TableCell>
                <TableCell className="text-end tabular-nums">
                  {formatCurrency(invoice.total_cents, invoice.currency)}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex justify-end gap-2">
                    <Link href={`/merchant/billing/invoices/${invoice.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View invoice</span>
                      </Button>
                    </Link>
                    {invoice.invoice_pdf_url && (
                      <a
                        href={invoice.invoice_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download PDF</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
