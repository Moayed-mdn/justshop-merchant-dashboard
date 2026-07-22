'use client';

import { useState }        from 'react';
import { useTranslations } from 'next-intl';
import { ImageIcon, Star } from 'lucide-react';

import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Switch }   from '@/components/ui/switch';
import { Badge }    from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

import { VariantMediaDialog } from '@/features/products/editor/components/VariantMediaDialog';
import { getVariantLabel }    from '@/features/products/editor/utils/getVariantLabel';

import type { ProductImage, ProductVariant } from '@/types/product';

interface Props {
  variants: ProductVariant[];
  defaultVariantId: number | null;
  onChange: (next: ProductVariant[]) => void;
  onDefaultVariantChange: (variantId: number | null) => void;
  storeSlug: string;
}

function parseNumericInput(value: string): number {
  const normalized = value.trim();
  if (normalized === '') return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function VariantsTable({ 
  variants, 
  defaultVariantId,
  onChange, 
  onDefaultVariantChange,
  storeSlug 
}: Props) {
  const t = useTranslations('products');
  const [numericDrafts, setNumericDrafts] = useState<Record<string, string>>({});

  const patch = (id: ProductVariant['id'], next: Partial<ProductVariant>) =>
    onChange(variants.map((v) => (v.id === id ? { ...v, ...next } : v)));

  const patchMedia = (id: ProductVariant['id'], media: ProductImage[]) => {
    patch(id, { media });
  };

  const updateDraft = (key: string, value: string) =>
    setNumericDrafts((prev) => ({ ...prev, [key]: value }));

  const clearDraft = (key: string) =>
    setNumericDrafts((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const handleNumericChange = (
    id:       ProductVariant['id'],
    field:    'price' | 'quantity',
    rawValue: string
  ) => {
    const draftKey = `${id}:${field}`;
    updateDraft(draftKey, rawValue);
    if (rawValue.trim() === '') return;
    const parsed = Number(rawValue.trim());
    if (!Number.isFinite(parsed)) return;
    patch(id, { [field]: parsed } as Pick<ProductVariant, 'price' | 'quantity'>);
  };

  const handleNumericBlur = (
    id:    ProductVariant['id'],
    field: 'price' | 'quantity'
  ) => {
    const draftKey   = `${id}:${field}`;
    const draftValue = numericDrafts[draftKey];
    if (draftValue === undefined) return;
    patch(id, { [field]: parseNumericInput(draftValue) } as Pick<ProductVariant, 'price' | 'quantity'>);
    clearDraft(draftKey);
  };

  return (
    <div className="space-y-3">
      {/* Info banner */}
      <TooltipProvider>
        <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <Star className="h-4 w-4 mt-0.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                {t('variantEditor.defaultVariant.tooltip')}
              </p>
            </TooltipContent>
          </Tooltip>
          <p className="text-muted-foreground">
            {t('variantEditor.defaultVariant.info')}
          </p>
        </div>
      </TooltipProvider>

      <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Star className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('variantEditor.defaultVariant.columnTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead>{t('variantEditor.variants.variant')}</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>{t('variantEditor.variants.price')}</TableHead>
            <TableHead>{t('variantEditor.variants.quantity')}</TableHead>
            <TableHead>{t('variantEditor.media.column')}</TableHead>
            <TableHead className="text-right">
              {t('variantEditor.variants.active')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((variant) => {
            const label      = getVariantLabel(variant.options);
            const mediaCount = (variant.media ?? []).length;
            const isDefault  = variant.id === defaultVariantId;

            return (
              <TableRow key={variant.id}>

                {/* Default variant selector */}
                <TableCell className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onDefaultVariantChange(
                            isDefault ? null : variant.id
                          )}
                        >
                          <Star 
                            className={`h-4 w-4 ${
                              isDefault 
                                ? 'fill-yellow-500 text-yellow-500' 
                                : 'text-muted-foreground'
                            }`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isDefault 
                            ? t('variantEditor.defaultVariant.unsetDefault')
                            : t('variantEditor.defaultVariant.setDefault')
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                {/* Variant label */}
                <TableCell className="min-w-32 text-sm font-medium">
                  {label}
                </TableCell>

                {/* SKU */}
                <TableCell className="min-w-40">
                  <Input
                    value={variant.sku ?? ''}
                    onChange={(e) => patch(variant.id, { sku: e.target.value })}
                  />
                </TableCell>

                {/* Price */}
                <TableCell className="min-w-28">
                  <Input
                    inputMode="decimal"
                    value={
                      numericDrafts[`${variant.id}:price`] ??
                      String(variant.price ?? 0)
                    }
                    onChange={(e) =>
                      handleNumericChange(variant.id, 'price', e.target.value)
                    }
                    onBlur={() => handleNumericBlur(variant.id, 'price')}
                  />
                </TableCell>

                {/* Quantity */}
                <TableCell className="min-w-28">
                  <Input
                    inputMode="numeric"
                    value={
                      numericDrafts[`${variant.id}:quantity`] ??
                      String(variant.quantity ?? 0)
                    }
                    onChange={(e) =>
                      handleNumericChange(variant.id, 'quantity', e.target.value)
                    }
                    onBlur={() => handleNumericBlur(variant.id, 'quantity')}
                  />
                </TableCell>

                {/* Variant media */}
                <TableCell className="min-w-28">
                  <VariantMediaDialog
                    variantLabel={label}
                    images={variant.media ?? []}
                    onChange={(media) => patchMedia(variant.id, media)}
                    storeSlug={storeSlug}
                    trigger={
                      /*
                       * Base UI render prop receives this element and merges
                       * its own event handlers onto it. Must be a single
                       * React element — not a fragment or string.
                       */
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        {mediaCount > 0 ? (
                          <Badge
                            variant="default"
                            className="px-1.5 py-0 text-xs bg-primary text-primary-foreground"
                          >
                            {mediaCount}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            {t('variantEditor.media.add')}
                          </span>
                        )}
                      </Button>
                    }
                  />
                </TableCell>

                {/* Active toggle */}
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Switch
                      checked={variant.is_active}
                      onCheckedChange={(checked) =>
                        patch(variant.id, { is_active: checked })
                      }
                    />
                  </div>
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
