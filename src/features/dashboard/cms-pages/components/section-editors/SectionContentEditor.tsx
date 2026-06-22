'use client';

/**
 * Section content editor router.
 * Renders the appropriate content/settings editor based on section type.
 */

import { VideoSectionContent } from './VideoSectionContent';
import { CtaSectionContent } from './CtaSectionContent';
import { CustomSectionContent } from './CustomSectionContent';
import { FeaturesSectionContent } from './FeaturesSectionContent';
import { FaqSectionContent } from './FaqSectionContent';
import { GallerySectionContent } from './GallerySectionContent';
import { TestimonialsSectionContent } from './TestimonialsSectionContent';
import { ContentSectionContent } from './ContentSectionContent';
import { PricingSectionContent } from './PricingSectionContent';
import { HeroSectionContent } from './HeroSectionContent';
import { ProductsSectionContent } from './ProductsSectionContent';
import { CategoryGridSectionContent } from './CategoryGridSectionContent';

interface SectionContentEditorProps {
  sectionType: string;
  sectionIndex: number;
  storeId: string;
}

export function SectionContentEditor({
  sectionType,
  sectionIndex,
  storeId,
}: SectionContentEditorProps) {
  switch (sectionType) {
    case 'video':
      return <VideoSectionContent index={sectionIndex} storeId={storeId} />;
    case 'cta':
      return <CtaSectionContent index={sectionIndex} />;
    case 'features':
      return <FeaturesSectionContent index={sectionIndex} storeId={storeId} />;
    case 'faq':
      return <FaqSectionContent index={sectionIndex} />;
    case 'gallery':
      return <GallerySectionContent index={sectionIndex} storeId={storeId} />;
    case 'testimonials':
      return <TestimonialsSectionContent index={sectionIndex} storeId={storeId} />;
    case 'content':
      return <ContentSectionContent index={sectionIndex} />;
    case 'pricing':
      return <PricingSectionContent index={sectionIndex} />;
    case 'hero':
      return <HeroSectionContent index={sectionIndex} storeId={storeId} />;
    case 'products':
      return <ProductsSectionContent index={sectionIndex} storeId={storeId} />;
    case 'category_grid':
      return <CategoryGridSectionContent index={sectionIndex} storeId={storeId} />;
    case 'custom':
    default:
      return <CustomSectionContent index={sectionIndex} />;
  }
}
