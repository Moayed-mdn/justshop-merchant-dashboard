/**
 * Invoice Detail Page
 * View individual invoice with line items
 */

import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Invoice Details',
    description: 'View invoice details and line items',
  };
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return <InvoiceDetailPageClient invoiceId={params.id} />;
}

import { InvoiceDetailPageClient } from './InvoiceDetailPageClient';
