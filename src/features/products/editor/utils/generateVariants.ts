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
  
  // DEBUG: Log existing variants to see if media is present
  console.log('[generateVariants] Input existing variants:', JSON.stringify(existing, null, 2));
  
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
      // Explicitly preserve all variant data including media
      const keptVariant = {
        ...v,
        // Ensure media array is preserved (don't let it be undefined)
        media: v.media ?? [],
      };
      
      console.log('[generateVariants] Keeping variant by signature:', {
        id: v.id,
        signature,
        inputMedia: v.media,
        keptMedia: keptVariant.media,
      });
      
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

    // Check if there's an existing variant we can reuse
    // (one that wasn't kept in first pass and hasn't been reused yet)
    const existingToUpdate = existing.find(v => !keptIds.has(v.id));
    
    if (existingToUpdate) {
      // Update existing variant's options but preserve everything else
      const updatedVariant = {
        ...existingToUpdate,
        options: variantOptions,
        media: existingToUpdate.media ?? [],  // Preserve media!
      };
      
      console.log('[generateVariants] Updating variant options:', {
        id: existingToUpdate.id,
        oldOptions: existingToUpdate.options,
        newOptions: variantOptions,
        preservedMedia: updatedVariant.media,
      });
      
      kept.push(updatedVariant);
      keptIds.add(existingToUpdate.id);
    } else {
      // No existing variant to reuse, create new one
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

  console.log('[generateVariants] Output kept variants:', JSON.stringify(kept, null, 2));

  return kept;
}
