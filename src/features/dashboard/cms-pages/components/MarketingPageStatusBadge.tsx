'use client';

import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import type { MarketingPageStatus } from '@/types/marketing-page';

interface Props {
  status: MarketingPageStatus;
}

export function MarketingPageStatusBadge({ status }: Props) {
  const t = useTranslations('cmsPages');

  const variantMap: Record<MarketingPageStatus, 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    scheduled: 'secondary',
    draft:     'outline',
  };

  return (
    <Badge variant={variantMap[status]}>
      {t(`status.${status}`)}
    </Badge>
  );
}
