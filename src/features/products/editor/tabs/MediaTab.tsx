'use client';

import type { ProductImage } from '@/types/product';
import { ProductMediaTab } from '@/features/products/editor/components/ProductMediaTab';

interface Props {
  images: ProductImage[];
  onChange: (next: ProductImage[]) => void;
  storeSlug: string;
}

export function MediaTab({ images, onChange, storeSlug }: Props) {
  return <ProductMediaTab images={images} onChange={onChange} storeSlug={storeSlug} />;
}
