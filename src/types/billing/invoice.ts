/**
 * Invoice Types
 * Must match backend DTOs exactly
 *
 * Raw types  → exact shape returned by Laravel InvoiceResource.
 * View types → mapped shape consumed by UI components.
 */

// ── Raw API types ─────────────────────────────────────────────────────────

export type InvoiceStatus =
  | 'draft'
  | 'open'
  | 'paid'
  | 'uncollectible'
  | 'void';

/** Invoice — raw API shape */
export interface Invoice {
  id: number;
  billing_account_id: number;
  subscription_id: number | null;
  provider: string;
  provider_invoice_id: string | null;
  invoice_number: string | null;
  status: InvoiceStatus;
  currency: string;
  subtotal_cents: number;
  tax_cents: number;
  discount_cents: number;
  total_cents: number;
  amount_paid_cents: number;
  amount_due_cents: number;
  period_starts_at: string | null;
  period_ends_at: string | null;
  issued_at: string | null;
  due_at: string | null;
  paid_at: string | null;
  hosted_invoice_url: string | null;
  invoice_pdf_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  line_items?: InvoiceLineItem[];
}

/** Invoice line item — raw API shape */
export interface InvoiceLineItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_amount_cents: number;
  total_cents: number;
  currency: string;
  period_starts_at: string | null;
  period_ends_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ── View types ────────────────────────────────────────────────────────────

/** Invoice — mapped for UI consumption */
export interface InvoiceView {
  id: number;
  billingAccountId: number;
  subscriptionId: number | null;
  provider: string;
  providerInvoiceId: string | null;
  invoiceNumber: string | null;
  status: InvoiceStatus;
  currency: string;
  subtotalCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  amountPaidCents: number;
  amountDueCents: number;
  periodStartsAt: string | null;
  periodEndsAt: string | null;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  hostedInvoiceUrl: string | null;
  invoicePdfUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  lineItems?: InvoiceLineItemView[];
}

/** Invoice line item — mapped for UI consumption */
export interface InvoiceLineItemView {
  id: number;
  invoiceId: number;
  description: string;
  quantity: number;
  unitAmountCents: number;
  totalCents: number;
  currency: string;
  periodStartsAt: string | null;
  periodEndsAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// ── Filter types ──────────────────────────────────────────────────────────

export interface InvoiceFilters {
  status?: InvoiceStatus;
  year?: number;
  page?: number;
  per_page?: number;
}
