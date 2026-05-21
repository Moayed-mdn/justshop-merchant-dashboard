'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import type { ProductOption } from '@/types/product';
import { getNextNegativeId } from '@/features/products/editor/utils/generateVariants';

interface Props {
  options: ProductOption[];
  onChange: (options: ProductOption[]) => void;
}

/**
 * ProductOptionsSection
 *
 * Renders the canonical product options editor.
 * Each option has a name (e.g. "Color") and a list of values (e.g. "Red", "Blue").
 * Options drive variant combination generation in the Structure tab.
 *
 * Internal state uses ProductOption / ProductOptionValue types:
 * - option.name    → display name
 * - option.position → order
 * - value.value   → the string value (e.g. "Red")
 * - value.id      → null for new, number for persisted
 */
export function ProductOptionsSection({ options, onChange }: Props) {
  const t = useTranslations('products');

  // ── Helpers ─────────────────────────────────────────────────────────────

  const normalizePositions = (nextOptions: ProductOption[]) =>
    nextOptions.map((opt, idx) => ({
      ...opt,
      position: idx + 1,
    }));

  // ── ID generators ────────────────────────────────────────────────────────

  const nextOptionId = () => {
    const existing = (options ?? []).flatMap((o) =>
      typeof o.id === 'number' ? [{ id: o.id }] : []
    );
    return getNextNegativeId(existing);
  };

  const nextValueId = (optionIndex: number) => {
    const existing = (options?.[optionIndex]?.values ?? []).flatMap((v) =>
      typeof v.id === 'number' ? [{ id: v.id }] : []
    );
    return getNextNegativeId(existing);
  };

  const nextGlobalValueId = () => {
    const existing = (options ?? []).flatMap((o) =>
      (o.values ?? []).flatMap((v) =>
        typeof v.id === 'number' ? [{ id: v.id }] : []
      )
    );
    return getNextNegativeId(existing);
  };

  // ── Option mutations ─────────────────────────────────────────────────────

  const updateOption = (index: number, patch: Partial<ProductOption>) => {
    onChange(
      options.map((opt, i) => (i === index ? { ...opt, ...patch } : opt))
    );
  };

  const addOption = () => {
    const newOption: ProductOption = {
      id: nextOptionId(),
      name: '',
      position: options.length + 1,
      values: [{ id: nextGlobalValueId(), value: '' }],
    };
    onChange(normalizePositions([...options, newOption]));
  };

  const removeOption = (index: number) => {
    onChange(normalizePositions(options.filter((_, i) => i !== index)));
  };

  const moveOption = (from: number, to: number) => {
    if (to < 0 || to >= options.length) return;
    const next = [...options];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(normalizePositions(next));
  };

  // ── Value mutations ──────────────────────────────────────────────────────

  const addValue = (optionIndex: number) => {
    updateOption(optionIndex, {
      values: [
        ...options[optionIndex].values,
        { id: nextValueId(optionIndex), value: '' },
      ],
    });
  };

  const removeValue = (optionIndex: number, valueIndex: number) => {
    updateOption(optionIndex, {
      values: options[optionIndex].values.filter(
        (_, vi) => vi !== valueIndex
      ),
    });
  };

  const updateValue = (
    optionIndex: number,
    valueIndex: number,
    value: string
  ) => {
    updateOption(optionIndex, {
      values: options[optionIndex].values.map((v, vi) =>
        vi === valueIndex ? { ...v, value } : v
      ),
    });
  };

  const moveValue = (
    optionIndex: number,
    from: number,
    to: number
  ) => {
    const values = options[optionIndex].values;
    if (to < 0 || to >= values.length) return;
    const next = [...values];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateOption(optionIndex, { values: next });
  };

  // ── Empty state ──────────────────────────────────────────────────────────

  if (options.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {t('variantEditor.options.noOptions')}
        </p>
        <Button type="button" variant="outline" onClick={addOption}>
          {t('variantEditor.options.addOption')}
        </Button>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {options.map((option, optIdx) => (
        <section
          key={option.id ?? `option-${optIdx}`}
          className="space-y-4 rounded-lg border p-4"
        >
          {/* Option header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <h3 className="text-sm font-medium leading-6 wrap-break-word">
                {option.name.trim() ||
                  t('variantEditor.options.optionName')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {option.values.length > 0
                  ? t('variantEditor.options.valuesCount', {
                      count: option.values.length,
                    })
                  : t('variantEditor.options.noValues')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => moveOption(optIdx, optIdx - 1)}
                  disabled={optIdx === 0}
                >
                  {t('editor.media.moveUp')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => moveOption(optIdx, optIdx + 1)}
                  disabled={optIdx === options.length - 1}
                >
                  {t('editor.media.moveDown')}
                </Button>
              </div>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeOption(optIdx)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Option name input */}
          <Input
            placeholder={t('variantEditor.options.optionName')}
            value={option.name}
            onChange={(e) =>
              updateOption(optIdx, { name: e.target.value })
            }
          />

          {/* Value preview badges */}
          <div className="flex flex-wrap gap-2">
            {option.values
              .filter((v) => v.value.trim().length > 0)
              .map((v, valueIdx) => (
                <span
                  key={v.id ?? `preview-${optIdx}-${valueIdx}`}
                  className="inline-flex max-w-full items-center rounded-full border bg-muted px-3 py-1 text-sm leading-6 wrap-break-word"
                >
                  {v.value}
                </span>
              ))}
          </div>

          {/* Value inputs */}
          <div className="grid gap-2 md:grid-cols-2">
            {option.values.map((val, valIdx) => (
              <div
                key={val.id ?? `val-${optIdx}-${valIdx}`}
                className="flex min-w-0 items-center gap-2 rounded-lg border bg-background px-3 py-2"
              >
                <Input
                  className="h-auto min-w-0 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0"
                  value={val.value}
                  onChange={(e) =>
                    updateValue(optIdx, valIdx, e.target.value)
                  }
                  placeholder={t('variantEditor.options.addValue')}
                />
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveValue(optIdx, valIdx, valIdx - 1)}
                    disabled={valIdx === 0}
                    className="rounded-full p-1 transition-colors hover:bg-muted disabled:opacity-30"
                  >
                    <X className="h-3 w-3 rotate-45" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveValue(optIdx, valIdx, valIdx + 1)}
                    disabled={valIdx === option.values.length - 1}
                    className="rounded-full p-1 transition-colors hover:bg-muted disabled:opacity-30"
                  >
                    <X className="h-3 w-3 -rotate-[135deg]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeValue(optIdx, valIdx)}
                    className="rounded-full p-1 transition-colors hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => addValue(optIdx)}
          >
            {t('variantEditor.options.addValue')}
          </Button>
        </section>
      ))}

      <Button type="button" variant="outline" onClick={addOption}>
        {t('variantEditor.options.addOption')}
      </Button>
    </div>
  );
}
