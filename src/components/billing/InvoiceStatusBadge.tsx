/**
 * Invoice Status Badge (Server Component)
 * Color-coded invoice status indicator
 */

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Ban } from 'lucide-react';
import type { InvoiceStatus } from '@/types/billing/invoice';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

const STATUS_CONFIG: Record<
  InvoiceStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  draft: {
    label: 'Draft',
    variant: 'outline',
    icon: Clock,
  },
  open: {
    label: 'Open',
    variant: 'default',
    icon: Clock,
  },
  paid: {
    label: 'Paid',
    variant: 'default',
    icon: CheckCircle,
  },
  uncollectible: {
    label: 'Uncollectible',
    variant: 'destructive',
    icon: XCircle,
  },
  void: {
    label: 'Void',
    variant: 'outline',
    icon: Ban,
  },
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
