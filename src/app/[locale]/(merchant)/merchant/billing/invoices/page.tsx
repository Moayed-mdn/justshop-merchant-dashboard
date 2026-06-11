/**
 * Invoice List Page
 * Browse all invoices with filters
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices',
  description: 'View and manage your billing invoices',
};

export default function InvoicesPage() {
  return <InvoicesPageClient />;
}

import { InvoicesPageClient } from './InvoicesPageClient';
