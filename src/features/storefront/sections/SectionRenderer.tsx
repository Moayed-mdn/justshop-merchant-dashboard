import type { RuntimeSection } from '@/types/runtime';
import HeaderSection from './HeaderSection';
import FooterSection from './FooterSection';
import FooterMinimalSection from './FooterMinimalSection';
import FooterLegalSection from './FooterLegalSection';
import PageContentSection from './PageContentSection';
import HeroSection from './HeroSection';
import ContentSection from './ContentSection';
import CtaSection from './CtaSection';
import RuntimeFallbackSection from './RuntimeFallbackSection';

const componentRegistry: Record<string, React.ComponentType<Record<string, unknown>>> = {
  HeaderSection,
  FooterSection,
  FooterMinimalSection,
  FooterLegalSection,
  PageContentSection,
  HeroSection,
  ContentSection,
  CtaSection,
  RuntimeFallbackSection,
};

interface SectionRendererProps {
  section: RuntimeSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const Component = componentRegistry[section.component];

  if (!Component) {
    return <RuntimeFallbackSection />;
  }

  return <Component {...section.props} />;
}
