'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  isComplete?: boolean;
}

export function TranslationStatusBadge({ isComplete }: Props) {
  const t = useTranslations('products');

  if (isComplete === undefined) return null;

  return (
    <Badge 
      variant={isComplete ? 'secondary' : 'outline'}
      className={cn(
        !isComplete && 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
      )}
    >
      {isComplete ? t('editor.translationStatus.complete') : t('editor.translationStatus.incomplete')}
    </Badge>
  );
}
