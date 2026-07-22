import type { ProductOption, ProductVariant, ProductVariantOption } from '@/types/product';
import { buildVariantSignature } from './variant-signatures';

type OptionValueRef = {
  option: ProductOption;
  value:  ProductOption['values'][number];
};

function buildCombinations(options: ProductOption[]): OptionValueRef[][] {
  const validOptions = (options ?? []).filter(
    (opt) => (opt.values ?? []).length > 0
  );
  if (validOptions.length === 0) return [];

  return validOptions.reduce<OptionValueRef[][]>((acc, option) => {
    const refs = option.values.map((value) => ({ option, value }));
    if (acc.length === 0) return refs.map((r) => [r]);
    const next: OptionValueRef[][] = [];
    for (const existing of acc) {
      for (const r of refs) next.push([...existing, r]);
    }
    return next;
  }, []);
}

export function getNextNegativeId(existing: { id: number }[]): number {
  const minId = (existing ?? []).reduce<number>(
    (min, v) => Math.min(min, v.id),
    0
  );
  return minId <= 0 ? minId - 1 : -1;
}

export function generateVariants(
  options:          ProductOption[],
  existingVariants: ProductVariant[]
): ProductVariant[] {
  const existing = existingVariants ?? [];
  const combos   = buildCombinations(options);
  if (combos.length === 0) return [];

  const defaultPrice = existing[0]?.price ?? 0;
  let nextNewId = getNextNegativeId(existing);

  const validSignatures:     string[]                            = [];
  const signatureToOptions = new Map<string, ProductVariantOption[]>();
  const seenSignatures     = new Set<string>();

  for (const combo of combos) {
    const variantOptions: ProductVariantOption[] = combo.map(
      ({ option, value }) => ({
        option_name:  option.name,
        option_value: value.value,
      })
    );
    const signature = buildVariantSignature(variantOptions);
    if (seenSignatures.has(signature)) continue;
    seenSignatures.add(signature);
    validSignatures.push(signature);
    signatureToOptions.set(signature, variantOptions);
  }

  const kept:           ProductVariant[] = [];
  const validSet        = new Set(validSignatures);
  const keptSignatures  = new Set<string>();
  const keptIds         = new Set<number>();

  // First pass: Keep variants that match by signature
  for (const v of existing) {
    const signature = buildVariantSignature(v.options);
    if (validSet.has(signature) && !keptSignatures.has(signature)) {
      const keptVariant = {
        ...v,
        media: v.media ?? [],
      };

      kept.push(keptVariant);
      keptSignatures.add(signature);
      keptIds.add(v.id);
    }
  }

  // Second pass: For variants that didn't match by signature,
  // check if we can update their options instead of discarding them
  for (const signature of validSignatures) {
    if (keptSignatures.has(signature)) continue;

    const variantOptions = signatureToOptions.get(signature);
    if (!variantOptions) continue;

    const existingToUpdate = existing.find(v => !keptIds.has(v.id));

    if (existingToUpdate) {
      const updatedVariant = {
        ...existingToUpdate,
        options: variantOptions,
        media: existingToUpdate.media ?? [],
      };

      kept.push(updatedVariant);
      keptIds.add(existingToUpdate.id);
    } else {
      kept.push({
        id:               nextNewId,
        sku:              null,
        price:            defaultPrice,
        quantity:         0,
        is_active:        true,
        options:          variantOptions,
        media:            [],
      });
      nextNewId -= 1;
    }

    keptSignatures.add(signature);
  }

  return kept;
}
