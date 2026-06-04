'use client';

/**
 * CategorySelect
 *
 * Dropdown for selecting a product category.
 * Fetches active categories for the given store.
 * Includes a "No category" option to clear the selection.
 *
 * onNameChange (optional): called whenever the resolved display name of the
 * selected category changes. Used by the create wizard to capture the name
 * for the review step without a second network fetch. Existing usages that
 * don't need the name can omit this prop — it is purely additive.
 */

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/categories/useCategories';
import { useCategoryDetail } from '@/hooks/categories/useCategoryDetail';

interface Props {
  storeId:  string;
  value:    number | null;
  onChange: (change: { id: number | null; name: string | null }) => void;
}

const NO_CATEGORY = '__none__';

export function CategorySelect({ storeId, value, onChange }: Props) {
  const t = useTranslations('products');

  const { data, isLoading } = useCategories(storeId);
  const categories = data?.data ?? [];
  const selectedCategory = categories.find((category) => category.id === value);
  const { data: selectedCategoryDetail } = useCategoryDetail(
    storeId,
    value !== null && !selectedCategory ? String(value) : '',
  );

  const handleChange = (raw: string | null) => {
    if (!raw || raw === NO_CATEGORY) {
      onChange({ id: null, name: null });
      return;
    }
    const parsed = parseInt(raw, 10);
    const id = Number.isFinite(parsed) ? parsed : null;
    const name = categories.find((c) => c.id === id)?.name ?? null;
    onChange({ id, name });
  };

  const selectValue = value !== null ? String(value) : NO_CATEGORY;
  const selectedCategoryName = selectedCategory?.name ?? selectedCategoryDetail?.name;
  const renderSelectedValue = useCallback(
    (currentValue: string | null) => {
      if (currentValue === NO_CATEGORY) {
        return t('form.fields.noCategoryOption');
      }

      if (currentValue === null) {
        return isLoading
          ? t('form.fields.loading')
          : t('form.fields.categoryPlaceholder');
      }

      return selectedCategoryName ?? t('form.fields.categoryPlaceholder');
    },
    [isLoading, selectedCategoryName, t],
  );

  return (
    <div className="space-y-2">
      <Label>{t('form.fields.category')}</Label>
      <Select
        value={selectValue}
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              isLoading
                ? t('form.fields.loading')
                : t('form.fields.categoryPlaceholder')
            }
          >
            {renderSelectedValue}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_CATEGORY}>
            {t('form.fields.noCategoryOption')}
          </SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
