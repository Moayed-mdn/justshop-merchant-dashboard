'use client';

import { useTranslations } from 'next-intl';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
  isPending: boolean;
}

export function StoreReviewStep({ onNext, onBack, isPending }: Props) {
  const t = useTranslations('onboarding.wizard.review');
  const { storeData } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 rounded-md bg-muted p-4 text-sm">
        <div className="font-medium text-muted-foreground">{t('nameLabel')}</div>
        <div className="font-semibold">{storeData.name}</div>
        
        <div className="font-medium text-muted-foreground">{t('slugLabel')}</div>
        <div className="font-semibold">{storeData.slug}</div>
        
        <div className="font-medium text-muted-foreground">{t('localeLabel')}</div>
        <div className="font-semibold uppercase">{storeData.locale}</div>
        
        <div className="font-medium text-muted-foreground">{t('timezoneLabel')}</div>
        <div className="font-semibold">{storeData.timezone}</div>
        
        <div className="font-medium text-muted-foreground">{t('currencyLabel')}</div>
        <div className="font-semibold">{storeData.currency}</div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack} disabled={isPending}>
          {t('backButton')}
        </Button>
        <Button type="button" className="flex-1" onClick={onNext} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submitButton')
          )}
        </Button>
      </div>
    </div>
  );
}
