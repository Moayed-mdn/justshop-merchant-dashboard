'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { ProductImage } from '@/types/product';
import { ProductImagesManager } from './ProductImagesManager';

interface Props {
  images: ProductImage[];
  onChange: (next: ProductImage[]) => void;
  storeSlug: string;
}

export function ProductMediaTab({ images, onChange, storeSlug }: Props) {
  return (
    <Card>
      <CardContent className="pt-6">
        <ProductImagesManager images={images} onChange={onChange} storeSlug={storeSlug} />
      </CardContent>
    </Card>
  );
}
