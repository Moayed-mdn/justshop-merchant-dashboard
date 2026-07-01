'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { useCreateBrand } from '@/hooks/brands/useCreateBrand';
import {
  BrandFormSchema,
  type BrandFormValues,
  type BrandFormInput,
} from '@/schemas/brands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GenericImageUploader } from '@/components/media/GenericImageUploader';
import { ROUTES } from '@/config/routes';

interface Props {
  storeSlug: string;
}

export default function CreateBrandForm({ storeSlug }: Props) {
  const t      = useTranslations('brands');
  const create = useCreateBrand(storeSlug);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormInput, unknown, BrandFormValues>({
    resolver:      zodResolver(BrandFormSchema),
    defaultValues: {
      name:        '',
      slug:        '',
      description: null,
      logo_url:    null,
      sort_order:  0,
      is_active:   true,
    },
  });

  const isActive = watch('is_active');
  const logoUrl  = watch('logo_url');

  const onSubmit = async (values: BrandFormValues) => {
    await create.mutateAsync({
      name:        values.name,
      slug:        values.slug,
      description: values.description,
      logo_url:    values.logo_url,
      sort_order:  values.sort_order,
      is_active:   values.is_active,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => router.push(ROUTES.merchant.brands.list())}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('form.createTitle')}</h1>
            <p className="text-muted-foreground">{t('form.createSubtitle')}</p>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('form.creating') : t('form.create')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('form.details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('form.fields.name')}</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder={t('form.fields.namePlaceholder')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('form.fields.description')}</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder={t('form.fields.descriptionPlaceholder')}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Logo Upload */}
              <GenericImageUploader
                value={logoUrl ?? ''}
                onChange={(path) => setValue('logo_url', path || null, { shouldDirty: true })}
                context="brands"
                storeSlug={storeSlug}
                label={t('form.fields.logoUrl')}
              />
              {errors.logo_url && (
                <p className="text-sm text-destructive">{errors.logo_url.message}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('form.settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">{t('form.fields.slug')}</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder={t('form.fields.slugPlaceholder')}
                  className="font-mono"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">{t('form.fields.sortOrder')}</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min={0}
                  {...register('sort_order', { valueAsNumber: true })}
                />
                {errors.sort_order && (
                  <p className="text-sm text-destructive">{errors.sort_order.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">{t('form.fields.isActive')}</Label>
                <Switch
                  id="is_active"
                  checked={isActive ?? true}
                  onCheckedChange={(v) => setValue('is_active', v)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}