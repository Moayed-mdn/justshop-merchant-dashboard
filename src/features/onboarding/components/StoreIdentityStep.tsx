'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useMemo } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { checkSlugAvailability } from '@/lib/api/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export function StoreIdentityStep({ onNext }: Props) {
  const t = useTranslations('onboarding.wizard.identity');
  const { storeData, updateStoreData } = useOnboardingStore();
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugStatus, setSlugStatus] = useState<'idle' | 'available' | 'taken' | 'error'>('idle');

  const Schema = useMemo(() => z.object({
    name: z.string().min(3, { message: t('errors.nameTooShort') }),
    slug: z.string()
      .min(3, { message: t('errors.slugTooShort') })
      .regex(/^[a-z0-9-]+$/, { message: t('errors.slugInvalid') }),
  }), [t]);

  type FormData = z.infer<typeof Schema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: storeData.name,
      slug: storeData.slug,
    },
    mode: 'onChange',
  });

  const name = watch('name');
  const slug = watch('slug');
  const debouncedSlug = useDebounce(slug, 500);

  // Auto-generate slug from name if slug hasn't been manually edited
  useEffect(() => {
    if (name && !slug) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [name, slug, setValue]);

  // Check slug availability
  useEffect(() => {
    if (debouncedSlug && debouncedSlug.length >= 3 && /^[a-z0-9-]+$/.test(debouncedSlug)) {
      const check = async () => {
        setIsCheckingSlug(true);
        try {
          const response = await checkSlugAvailability(debouncedSlug);
          setSlugStatus(response.data.available ? 'available' : 'taken');
        } catch (error) {
          setSlugStatus('error');
        } finally {
          setIsCheckingSlug(false);
        }
      };
      check();
    } else {
      setSlugStatus('idle');
    }
  }, [debouncedSlug]);

  const onSubmit = (data: FormData) => {
    if (slugStatus !== 'available') return;
    updateStoreData(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{t('nameLabel')}</Label>
        <Input
          id="name"
          placeholder={t('namePlaceholder')}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">{t('slugLabel')}</Label>
        <div className="relative">
          <Input
            id="slug"
            placeholder={t('slugPlaceholder')}
            {...register('slug')}
            className="pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isCheckingSlug && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {!isCheckingSlug && slugStatus === 'available' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            {!isCheckingSlug && slugStatus === 'taken' && <XCircle className="h-4 w-4 text-destructive" />}
          </div>
        </div>
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        {slugStatus === 'taken' && (
          <p className="text-sm text-destructive">{t('errors.slugTaken')}</p>
        )}
        {slugStatus === 'available' && (
          <p className="text-sm text-green-500">{t('slugAvailable')}</p>
        )}
        <p className="text-xs text-muted-foreground">{t('slugHint')}</p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isValid || isCheckingSlug || slugStatus !== 'available'}
      >
        {t('submitButton')}
      </Button>
    </form>
  );
}
