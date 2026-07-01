'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreateShippingMethod, useUpdateShippingMethod } from '@/hooks/shipping/useShippingMethods';
import type { ShippingMethod, CreateShippingMethodPayload } from '@/types/shipping';

interface ShippingMethodDialogProps {
  storeSlug: string;
  method?: ShippingMethod | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShippingMethodDialog({
  storeSlug,
  method,
  open,
  onOpenChange,
}: ShippingMethodDialogProps) {
  const t = useTranslations('shipping');
  const createMutation = useCreateShippingMethod(storeSlug);
  const updateMutation = useUpdateShippingMethod(storeSlug, method?.id.toString() || '');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateShippingMethodPayload>({
    defaultValues: {
      is_active: true,
      currency: 'USD',
      sort_order: 0,
    },
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (method) {
      reset({
        name: method.name,
        code: method.code,
        description: method.description || '',
        price: method.price,
        currency: method.currency,
        min_order_amount: method.min_order_amount || undefined,
        max_order_amount: method.max_order_amount || undefined,
        estimated_delivery_days: method.estimated_delivery_days || undefined,
        min_delivery_days: method.min_delivery_days || undefined,
        max_delivery_days: method.max_delivery_days || undefined,
        is_active: method.is_active,
        sort_order: method.sort_order,
      });
    } else {
      reset({
        is_active: true,
        currency: 'USD',
        sort_order: 0,
      });
    }
  }, [method, reset]);

  const onSubmit = (data: CreateShippingMethodPayload) => {
    if (method) {
      updateMutation.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{method ? t('methods.edit') : t('methods.addNew')}</DialogTitle>
          <DialogDescription>{t('methods.subtitle')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('methods.fields.name')}</Label>
              <Input
                id="name"
                {...register('name', { required: true })}
                placeholder={t('methods.fields.namePlaceholder')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{t('validation.nameRequired')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">{t('methods.fields.code')}</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder={t('methods.fields.codePlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('methods.fields.description')}</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('methods.fields.descriptionPlaceholder')}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('methods.fields.price')}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { required: true, min: 0, valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{t('validation.priceRequired')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t('methods.fields.currency')}</Label>
              <Input
                id="currency"
                {...register('currency')}
                placeholder="USD"
                maxLength={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_order_amount">{t('methods.fields.minOrderAmount')}</Label>
              <Input
                id="min_order_amount"
                type="number"
                step="0.01"
                {...register('min_order_amount', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_order_amount">{t('methods.fields.maxOrderAmount')}</Label>
              <Input
                id="max_order_amount"
                type="number"
                step="0.01"
                {...register('max_order_amount', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_delivery_days">{t('methods.fields.estimatedDeliveryDays')}</Label>
              <Input
                id="estimated_delivery_days"
                type="number"
                {...register('estimated_delivery_days', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_delivery_days">{t('methods.fields.minDeliveryDays')}</Label>
              <Input
                id="min_delivery_days"
                type="number"
                {...register('min_delivery_days', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_delivery_days">{t('methods.fields.maxDeliveryDays')}</Label>
              <Input
                id="max_delivery_days"
                type="number"
                {...register('max_delivery_days', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort_order">{t('methods.fields.sortOrder')}</Label>
              <Input
                id="sort_order"
                type="number"
                {...register('sort_order', { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue('is_active', checked)}
              />
              <Label htmlFor="is_active">{t('methods.fields.isActive')}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('common.saving') : method ? t('common.update') : t('common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
