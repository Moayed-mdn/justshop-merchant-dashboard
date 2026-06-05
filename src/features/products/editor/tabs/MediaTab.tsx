'use client';

import type { ProductImage } from '@/types/product';
import { ProductMediaTab } from '@/features/products/editor/components/ProductMediaTab';

interface Props {
  images: ProductImage[];
  onChange: (next: ProductImage[]) => void;
  storeId: string;
}

export function MediaTab({ images, onChange, storeId }: Props) {
  return <ProductMediaTab images={images} onChange={onChange} storeId={storeId} />;
}
