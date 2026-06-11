/**
 * Invoice Detail Page Client Component
 * Displays invoice details and line items
 */

'use client';

import { useInvoice } from '@/hooks/billing/useInvoice';
import { InvoiceStatusBadge } from '@/components/billing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/billing/billing-utils';

interface InvoiceDetailPageClientProps {
  invoiceId: string;
}

export function InvoiceDetailPageClient({ invoiceId }: InvoiceDetailPageClientProps) {
  const { data: invoice, isLoading, error } = useInvoice(Number(invoiceId));

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Invoice Details</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Invoice Not Found</h1>
          <p className="text-muted-foreground">The requested invoice could not be found.</p>
        </div>
        <Link href="/merchant/billing/invoices">
          <Button variant="outline">
            <ArrowLeft className="me-2 h-4 w-4" />
            Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/merchant/billing/invoices">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="me-2 h-4 w-4" />
          Back to Invoices
        </Button>
      </Link>

      {/* Invoice Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Invoice {invoice.invoice_number || `#${invoice.id}`}
          </h1>
          <p className="text-muted-foreground">
            Issued on{' '}
            {invoice.issued_at ? formatDate(invoice.issued_at) : formatDate(invoice.created_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <InvoiceStatusBadge status={invoice.status} />
          {invoice.invoice_pdf_url && (
            <a href={invoice.invoice_pdf_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Download className="me-2 h-4 w-4" />
                Download PDF
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Invoice Number</span>
              <span className="font-mono text-sm font-medium">
                {invoice.invoice_number || `INV-${invoice.id}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Invoice Date</span>
              <span className="text-sm font-medium">
                {invoice.issued_at ? formatDate(invoice.issued_at) : formatDate(invoice.created_at)}
              </span>
            </div>
            {invoice.due_at && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="text-sm font-medium">{formatDate(invoice.due_at)}</span>
              </div>
            )}
            {invoice.paid_at && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Paid Date</span>
                <span className="text-sm font-medium">{formatDate(invoice.paid_at)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-sm font-medium">
                {formatCurrency(invoice.subtotal_cents, invoice.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tax</span>
              <span className="text-sm font-medium">
                {formatCurrency(invoice.tax_cents, invoice.currency)}
              </span>
            </div>
            {invoice.discount_cents !== 0 && (
              <div className="flex justify-between text-green-600">
                <span className="text-sm">Discount</span>
                <span className="text-sm font-medium">
                  -{formatCurrency(Math.abs(invoice.discount_cents), invoice.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold">
                {formatCurrency(invoice.total_cents, invoice.currency)}
              </span>
            </div>
            {invoice.amount_paid_cents > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="text-sm">Paid</span>
                <span className="text-sm font-medium">
                  {formatCurrency(invoice.amount_paid_cents, invoice.currency)}
                </span>
              </div>
            )}
            {invoice.amount_due_cents > 0 && (
              <div className="flex justify-between text-red-600">
                <span className="text-sm">Due</span>
                <span className="text-sm font-medium">
                  {formatCurrency(invoice.amount_due_cents, invoice.currency)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      {invoice.line_items && invoice.line_items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoice.line_items.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} ×{' '}
                      {formatCurrency(item.unit_amount_cents, item.currency)}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.total_cents, item.currency)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
