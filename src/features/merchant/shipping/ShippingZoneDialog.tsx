'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateShippingZone, useUpdateShippingZone } from '@/hooks/shipping/useShippingZones';
import { COUNTRY_GROUPS } from '@/types/shipping';
import type { ShippingZone, CreateShippingZonePayload } from '@/types/shipping';

interface ShippingZoneDialogProps {
  storeSlug: string;
  zone?: ShippingZone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShippingZoneDialog({
  storeSlug,
  zone,
  open,
  onOpenChange,
}: ShippingZoneDialogProps) {
  const t = useTranslations('shipping');
  const createMutation = useCreateShippingZone(storeSlug);
  const updateMutation = useUpdateShippingZone(storeSlug, zone?.id.toString() || '');

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateShippingZonePayload>({
    defaultValues: {
      is_active: true,
    },
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (zone) {
      reset({
        name: zone.name,
        countries: zone.countries,
        regions: zone.regions || undefined,
        postal_code_patterns: zone.postal_code_patterns || undefined,
        is_active: zone.is_active,
      });
      setSelectedCountries(zone.countries);
    } else {
      reset({
        is_active: true,
        countries: [],
      });
      setSelectedCountries([]);
    }
  }, [zone, reset]);

  const toggleCountry = (countryCode: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryCode)) {
        return prev.filter(c => c !== countryCode);
      } else {
        return [...prev, countryCode];
      }
    });
  };

  const selectAllInRegion = (region: string) => {
    const regionCountries = COUNTRY_GROUPS[region].map(c => c.code);
    const allSelected = regionCountries.every(code => selectedCountries.includes(code));
    
    if (allSelected) {
      // Deselect all in region
      setSelectedCountries(prev => prev.filter(c => !regionCountries.includes(c)));
    } else {
      // Select all in region
      setSelectedCountries(prev => {
        const newSelection = [...prev];
        regionCountries.forEach(code => {
          if (!newSelection.includes(code)) {
            newSelection.push(code);
          }
        });
        return newSelection;
      });
    }
  };

  const onSubmit = (data: CreateShippingZonePayload) => {
    const payload = {
      ...data,
      countries: selectedCountries,
    };

    if (zone) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
          setSelectedCountries([]);
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
          setSelectedCountries([]);
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{zone ? t('zones.edit') : t('zones.addNew')}</DialogTitle>
          <DialogDescription>{t('zones.subtitle')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t('zones.fields.name')}</Label>
              <Input
                id="name"
                {...register('name', { required: true })}
                placeholder={t('zones.fields.namePlaceholder')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{t('validation.nameRequired')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('zones.fields.countries')}</Label>
              <div className="text-sm text-muted-foreground mb-2">
                {selectedCountries.length > 0 
                  ? `${selectedCountries.length} ${t('zones.countryCount', { count: selectedCountries.length })}`
                  : t('zones.fields.countriesPlaceholder')
                }
              </div>
              
              <ScrollArea className="h-[300px] border rounded-md p-4">
                {Object.entries(COUNTRY_GROUPS).map(([region, countries]) => {
                  const regionCountries = countries.map(c => c.code);
                  const allSelectedInRegion = regionCountries.every(code => selectedCountries.includes(code));
                  const someSelectedInRegion = regionCountries.some(code => selectedCountries.includes(code));

                  return (
                    <div key={region} className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={`region-${region}`}
                          checked={allSelectedInRegion}
                          onCheckedChange={() => selectAllInRegion(region)}
                          className={someSelectedInRegion && !allSelectedInRegion ? 'opacity-50' : ''}
                        />
                        <Label
                          htmlFor={`region-${region}`}
                          className="text-sm font-semibold cursor-pointer"
                        >
                          {region}
                        </Label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {countries.map((country) => (
                          <div key={country.code} className="flex items-center space-x-2">
                            <Checkbox
                              id={`country-${country.code}`}
                              checked={selectedCountries.includes(country.code)}
                              onCheckedChange={() => toggleCountry(country.code)}
                            />
                            <Label
                              htmlFor={`country-${country.code}`}
                              className="text-sm cursor-pointer flex items-center"
                            >
                              <span className="mr-2">{country.code}</span>
                              <span>{country.name}</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
              {selectedCountries.length === 0 && (
                <p className="text-sm text-destructive">
                  {t('validation.countriesRequired')}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue('is_active', checked)}
              />
              <Label htmlFor="is_active">{t('zones.fields.isActive')}</Label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || selectedCountries.length === 0}
            >
              {isLoading ? t('common.saving') : zone ? t('common.update') : t('common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
