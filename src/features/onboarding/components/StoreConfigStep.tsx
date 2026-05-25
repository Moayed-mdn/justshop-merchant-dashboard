'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function StoreConfigStep({ onNext, onBack }: Props) {
  const t = useTranslations('onboarding.wizard.config');
  const { storeData, updateStoreData } = useOnboardingStore();

  const Schema = useMemo(() => z.object({
    locale: z.string().min(1),
    timezone: z.string().min(1),
    currency: z.string().min(1),
  }), []);

  type FormData = z.infer<typeof Schema>;

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      locale: storeData.locale,
      timezone: storeData.timezone,
      currency: storeData.currency,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: FormData) => {
    updateStoreData(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>{t('localeLabel')}</Label>
        <Select 
          onValueChange={(v) => {
            if (v) {
              setValue('locale', v, { shouldValidate: true });
            }
          }} 
          defaultValue={watch('locale') ?? 'en'}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('localePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('timezoneLabel')}</Label>
        <Select 
          onValueChange={(v) => {
            if (v) {
              setValue('timezone', v, { shouldValidate: true });
            }
          }} 
          defaultValue={watch('timezone') ?? 'UTC'}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('timezonePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
            <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
            <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('currencyLabel')}</Label>
        <Select 
          onValueChange={(v) => {
            if (v) {
              setValue('currency', v, { shouldValidate: true });
            }
          }} 
          defaultValue={watch('currency') ?? 'USD'}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('currencyPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="EUR">EUR (€)</SelectItem>
            <SelectItem value="GBP">GBP (£)</SelectItem>
            <SelectItem value="AED">AED (د.إ)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          {t('backButton')}
        </Button>
        <Button type="submit" className="flex-1" disabled={!isValid}>
          {t('submitButton')}
        </Button>
      </div>
    </form>
  );
}
