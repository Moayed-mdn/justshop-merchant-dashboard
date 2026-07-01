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
  storeSlug: string;
}

export function SectionContentEditor({
  sectionType,
  sectionIndex,
  storeSlug,
}: SectionContentEditorProps) {
  switch (sectionType) {
    case 'video':
      return <VideoSectionContent index={sectionIndex} storeSlug={storeSlug} />;
    case 'cta':
      return <CtaSectionContent index={sectionIndex} />;
    case 'features':
      return <FeaturesSectionContent index={sectionIndex} storeSlug={storeSlug} />;
    case 'faq':
      return <FaqSectionContent index={sectionIndex} />;
    case 'gallery':
      return <GallerySectionContent index={sectionIndex} storeSlug={storeSlug} />;
    case 'testimonials':
      return <TestimonialsSectionContent index={sectionIndex} storeSlug={storeSlug} />;
    case 'content':
      return <ContentSectionContent index={sectionIndex} />;
    case 'pricing':
      return <PricingSectionContent index={sectionIndex} />;
    case 'hero':
      return <HeroSectionContent index={sectionIndex} storeSlug={storeSlug} />;
    case 'products':
      return <ProductsSectionContent index={sectionIndex} storeSlug={storeSlug} />;
    case 'category_grid':
      return <CategoryGridSectionContent index={sectionIndex} storeSlug={storeSlug} />;
    case 'custom':
    default:
      return <CustomSectionContent index={sectionIndex} />;
  }
}
