'use client';

/**
 * Products section content editor.
 * Reads: content.product_ids[], settings { columns, style, show_prices, show_add_to_cart }
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductPicker } from '../ProductPicker';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface ProductsSectionContentProps {
  index: number;
  storeId: string;
}

export function ProductsSectionContent({ index, storeId }: ProductsSectionContentProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue } = useFormContext<MarketingPageFormValues>();

  const basePath = `sections.${index}`;
  const productIds = (watch(`${basePath}.content.product_ids` as any) ?? []) as (string | number)[];
  const columns = (watch(`${basePath}.settings.columns` as any) ?? 4) as number;
  const style = (watch(`${basePath}.settings.style` as any) ?? 'grid') as string;
  const showPrices = (watch(`${basePath}.settings.show_prices` as any) ?? true) as boolean;
  const showAddToCart = (watch(`${basePath}.settings.show_add_to_cart` as any) ?? true) as boolean;

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.products.heading')}
      </h4>

      {/* Product picker */}
      <div className="space-y-2">
        <Label>{t('sections.editors.products.selectProducts')}</Label>
        <ProductPicker
          storeId={storeId}
          selectedIds={productIds}
          onChange={(ids) =>
            setValue(`${basePath}.content.product_ids` as any, ids, { shouldDirty: true })
          }
        />
      </div>

      {/* Settings */}
      <div className="space-y-3 rounded border p-3 bg-background">
        <Label className="text-xs font-medium">{t('sections.editors.products.settings')}</Label>

        {/* Columns */}
        <div className="space-y-2">
          <Label className="text-xs">{t('sections.editors.products.columns')}</Label>
          <Input
            type="number"
            min={1}
            max={6}
            value={columns}
            onChange={(e) =>
              setValue(`${basePath}.settings.columns` as any, parseInt(e.target.value) || 4, {
                shouldDirty: true,
              })
            }
          />
        </div>

        {/* Style */}
        <div className="space-y-2">
          <Label className="text-xs">{t('sections.editors.products.style')}</Label>
          <Select
            value={style}
            onValueChange={(v) =>
              setValue(`${basePath}.settings.style` as any, v, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">{t('sections.editors.products.styleGrid')}</SelectItem>
              <SelectItem value="carousel">{t('sections.editors.products.styleCarousel')}</SelectItem>
              <SelectItem value="list">{t('sections.editors.products.styleList')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show prices */}
        <div className="flex items-center justify-between">
          <Label htmlFor={`${basePath}.settings.show_prices`} className="text-xs">
            {t('sections.editors.products.showPrices')}
          </Label>
          <Switch
            id={`${basePath}.settings.show_prices`}
            checked={showPrices}
            onCheckedChange={(v) =>
              setValue(`${basePath}.settings.show_prices` as any, v, { shouldDirty: true })
            }
          />
        </div>

        {/* Show add to cart */}
        <div className="flex items-center justify-between">
          <Label htmlFor={`${basePath}.settings.show_add_to_cart`} className="text-xs">
            {t('sections.editors.products.showAddToCart')}
          </Label>
          <Switch
            id={`${basePath}.settings.show_add_to_cart`}
            checked={showAddToCart}
            onCheckedChange={(v) =>
              setValue(`${basePath}.settings.show_add_to_cart` as any, v, { shouldDirty: true })
            }
          />
        </div>
      </div>
    </div>
  );
}
