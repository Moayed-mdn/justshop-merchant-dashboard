import { useTranslations } from 'next-intl';
import HeroSection from '@/features/marketing/sections/HeroSection';
import CTASection from '@/features/marketing/sections/CTASection';
import FAQSection from '@/features/marketing/sections/FAQSection';
import TestimonialsSection from '@/features/marketing/sections/TestimonialsSection';
import StatsSection from '@/features/marketing/sections/StatsSection';
import LogoCloudSection from '@/features/marketing/sections/LogoCloudSection';
import FeatureGridSection from '@/features/marketing/sections/FeatureGridSection';
import PricingSection from '@/features/marketing/sections/PricingSection';
import DashboardShowcaseSection from '@/features/marketing/sections/DashboardShowcaseSection';
import WorkflowSection from '@/features/marketing/sections/WorkflowSection';
import DetailGridSection from '@/features/marketing/sections/DetailGridSection';
import ActionCardSection from '@/features/marketing/sections/ActionCardSection';
import ComparisonTableSection from '@/features/marketing/sections/ComparisonTableSection';
import FeatureGroupsSection from '@/features/marketing/sections/FeatureGroupsSection';
import IntegrationsSection from '@/features/marketing/sections/IntegrationsSection';
import SimpleFeatureSection from '@/features/marketing/sections/SimpleFeatureSection';
import EnterpriseFeaturesSection from '@/features/marketing/sections/EnterpriseFeaturesSection';
import ComplianceSection from '@/features/marketing/sections/ComplianceSection';
import EnterpriseHighlightSection from '@/features/marketing/sections/EnterpriseHighlightSection';
import CaseStudiesSection from '@/features/marketing/sections/CaseStudiesSection';
import CategoryGridSection from '@/features/marketing/sections/CategoryGridSection';
import ProductWalkthroughSection from '@/features/marketing/sections/ProductWalkthroughSection';
import TemplateShowcaseSection from '@/features/marketing/sections/TemplateShowcaseSection';
import IndustryUseCasesSection from '@/features/marketing/sections/IndustryUseCasesSection';
import PerformanceMetricsSection from '@/features/marketing/sections/PerformanceMetricsSection';
import ContactInfoSection from '@/features/marketing/sections/ContactInfoSection';
import { CmsSections } from '@/types/cms';

interface CmsSectionRendererProps {
  sections?: CmsSections;
  /** Optional list of section keys to render. If provided, only these will render. */
  includeOnly?: string[];
  /** Optional list of section keys to exclude. */
  exclude?: string[];
}

/**
 * Renders marketing sections based on the Laravel CMS 'sections' contract.
 * Maps CMS payload fields to frontend component props exactly.
 */
export function CmsSectionRenderer({ sections, includeOnly, exclude }: CmsSectionRendererProps) {
  const t = useTranslations('marketing.sections');
  const tHome = useTranslations('marketing.home');
  if (!sections) return null;

  const shouldRender = (key: string) => {
    if (exclude?.includes(key)) return false;
    if (!includeOnly) return true;
    return includeOnly.includes(key);
  };

  return (
    <>
      {/* Hero Section */}
      {sections.hero && shouldRender('hero') && (
        <HeroSection
          badge={sections.hero.badge || undefined}
          headline={sections.hero.title}
          subtext={sections.hero.subtitle}
          // Only render CTAs if labels are present, handle both string and object formats
          primaryCta={sections.hero.cta_primary ? (
            typeof sections.hero.cta_primary === 'string' 
              ? { label: sections.hero.cta_primary, href: '/signup' }
              : { label: sections.hero.cta_primary.label, href: sections.hero.cta_primary.url }
          ) : undefined}
          secondaryCta={sections.hero.cta_secondary ? (
            typeof sections.hero.cta_secondary === 'string'
              ? { label: sections.hero.cta_secondary, href: '/demo' }
              : { label: sections.hero.cta_secondary.label, href: sections.hero.cta_secondary.url }
          ) : undefined}
          previewAlt={sections.hero.title}
          previewSrc={sections.hero.image || undefined}
        />
      )}

      {/* Enterprise Specific Sections */}
      {sections.enterprise_features && sections.enterprise_features.length > 0 && shouldRender('enterprise_features') && (
        <EnterpriseFeaturesSection 
          features={sections.enterprise_features} 
          heading={t('enterprise.capabilities_heading')}
        />
      )}

      {sections.scalability && shouldRender('scalability') && (
        <EnterpriseHighlightSection data={sections.scalability} className="bg-muted/10" />
      )}

      {sections.compliance && shouldRender('compliance') && (
        <ComplianceSection data={sections.compliance} />
      )}

      {sections.infrastructure && shouldRender('infrastructure') && (
        <EnterpriseHighlightSection data={sections.infrastructure} className="bg-muted/10" />
      )}

      {sections.support && shouldRender('support') && (
        <EnterpriseHighlightSection data={sections.support} />
      )}

      {sections.case_studies && sections.case_studies.length > 0 && shouldRender('case_studies') && (
        <CaseStudiesSection 
          studies={sections.case_studies} 
          heading={t('enterprise.success_stories_heading')}
        />
      )}

      {/* Feature Groups (Specific to Features Page) */}
      {sections.feature_groups && sections.feature_groups.length > 0 && shouldRender('feature_groups') && (
        <FeatureGroupsSection 
          groups={sections.feature_groups} 
          heading={t('features.heading')}
        />
      )}

      {/* Categories (Docs & Blog) */}
      {sections.categories && sections.categories.length > 0 && shouldRender('categories') && (
        <CategoryGridSection 
          categories={sections.categories} 
          heading={typeof sections.categories[0] === 'string' ? t('categories.blog_heading') : t('categories.documentation_heading')}
        />
      )}

      {/* Individual Feature Sections (Automation, Analytics, etc.) */}
      {sections.automation && shouldRender('automation') && (
        <SimpleFeatureSection data={sections.automation} />
      )}
      {sections.analytics && shouldRender('analytics') && (
        <SimpleFeatureSection data={sections.analytics} className="bg-muted/10" />
      )}
      {sections.mobile && shouldRender('mobile') && (
        <SimpleFeatureSection data={sections.mobile} />
      )}
      {sections.security && shouldRender('security') && (
        <SimpleFeatureSection data={sections.security} className="bg-muted/10" />
      )}

      {/* Demo Page Specific Sections */}
      {sections.product_walkthrough && shouldRender('product_walkthrough') && (
        <ProductWalkthroughSection 
          heading={sections.product_walkthrough.heading}
          steps={sections.product_walkthrough.steps}
        />
      )}

      {sections.dashboard_preview && shouldRender('dashboard_preview') && (
        <DashboardShowcaseSection 
          heading={sections.dashboard_preview.heading}
          subtext={sections.dashboard_preview.subtext}
          previewAlt={sections.dashboard_preview.heading}
          previewSrc={sections.dashboard_preview.image}
        />
      )}

      {sections.automation_features && shouldRender('automation_features') && (
        <SimpleFeatureSection data={sections.automation_features} className="bg-muted/10" />
      )}

      {sections.analytics_preview && shouldRender('analytics_preview') && (
        <SimpleFeatureSection data={sections.analytics_preview} />
      )}

      {/* Templates Page Specific Sections */}
      {sections.template_categories && shouldRender('template_categories') && (
        <CategoryGridSection 
          categories={sections.template_categories} 
          heading={t('templates.categories_heading')}
        />
      )}

      {sections.featured_templates && shouldRender('featured_templates') && (
        <TemplateShowcaseSection 
          heading={sections.featured_templates.heading}
          subtitle={sections.featured_templates.subtitle}
          templates={sections.featured_templates.templates}
        />
      )}

      {sections.industry_use_cases && shouldRender('industry_use_cases') && (
        <IndustryUseCasesSection 
          heading={t('templates.use_cases_heading')}
          useCases={sections.industry_use_cases}
        />
      )}

      {sections.customization_features && shouldRender('customization_features') && (
        <SimpleFeatureSection data={sections.customization_features} className="bg-muted/10" />
      )}

      {sections.storefront_capabilities && shouldRender('storefront_capabilities') && (
        <SimpleFeatureSection data={sections.storefront_capabilities} />
      )}

      {sections.mobile_experience && shouldRender('mobile_experience') && (
        <SimpleFeatureSection data={sections.mobile_experience} className="bg-muted/10" />
      )}

      {sections.performance_features && shouldRender('performance_features') && (
        <PerformanceMetricsSection 
          heading={sections.performance_features.heading}
          metrics={sections.performance_features.metrics}
        />
      )}

      {/* Contact Page Specific Sections */}
      {(sections.contact_methods || sections.office_locations || sections.support_hours) && 
        shouldRender('contact_info') && (
        <ContactInfoSection 
          methods={sections.contact_methods}
          locations={sections.office_locations}
          hours={sections.support_hours}
        />
      )}

      {/* Integrations Section */}
      {sections.integrations && sections.integrations.length > 0 && shouldRender('integrations') && (
        <IntegrationsSection 
          integrations={sections.integrations} 
          heading={t('integrations.heading')}
          subtitle={t('integrations.subtext')}
        />
      )}

      {/* Stats Section */}
      {sections.stats && sections.stats.length > 0 && shouldRender('stats') && (
        <StatsSection 
          items={sections.stats.map((s, idx) => ({
            id: s.id ? String(s.id) : `stat-${idx}`,
            label: s.label,
            value: s.value,
            description: s.description || ''
          }))} 
        />
      )}

      {/* Logo Cloud Section */}
      {sections.logos && shouldRender('logos') && (
        <LogoCloudSection 
          label={sections.logos.label || tHome('logos.label')}
          items={sections.logos.items || []}
        />
      )}

      {/* Features Section (Generic) */}
      {sections.features && shouldRender('features') && (
        <FeatureGridSection 
          heading={sections.features.heading}
          eyebrow={sections.features.eyebrow}
          subtitle={sections.features.subtitle}
          items={(sections.features.items || []).map((item, idx) => ({
            id: String(idx),
            icon: 'Check', // Default icon for CMS features if not provided
            title: item.title,
            description: item.desc
          }))}
        />
      )}

      {/* Showcase Section */}
      {sections.showcase && shouldRender('showcase') && (
        <DashboardShowcaseSection 
          heading={sections.showcase.heading}
          subtext={sections.showcase.subtext}
          previewAlt={sections.showcase.heading}
          cta={sections.showcase.cta ? (
            typeof sections.showcase.cta === 'string'
              ? { label: sections.showcase.cta, href: '/signup' }
              : { label: sections.showcase.cta.label, href: sections.showcase.cta.url }
          ) : undefined}
        />
      )}

      {/* Testimonials Section */}
      {sections.testimonials && sections.testimonials.length > 0 && shouldRender('testimonials') && (
        <TestimonialsSection 
          heading={t('testimonials.heading')} 
          items={sections.testimonials.map((t, idx) => ({
            id: t.id ? String(t.id) : `testimonial-${idx}`,
            quote: t.quote,
            authorName: t.author,
            authorRole: t.role,
            avatarSrc: t.avatar || undefined
          }))} 
        />
      )}

      {/* Pricing Section - Direct 'plans' from sections */}
      {sections.plans && sections.plans.length > 0 && shouldRender('plans') && (
        <PricingSection 
          heading={t('pricing.plans_heading')}
          plans={sections.plans.map((p, idx) => ({
            id: `plan-${idx}`,
            name: p.name,
            description: p.limits,
            monthlyPrice: parseFloat(p.price_monthly.replace(/[^0-9.]/g, '')) || 0,
            annualPrice: parseFloat(p.price_yearly.replace(/[^0-9.]/g, '')) || 0,
            currency: p.price_monthly.charAt(0) === '$' ? '$' : '',
            highlighted: !!p.featured,
            ctaLabel: p.cta,
            ctaHref: '/signup',
            features: p.features.map(f => ({ label: f, included: true }))
          }))} 
        />
      )}

      {/* Comparison Table Section */}
      {sections.comparison_table && shouldRender('comparison_table') && (
        <ComparisonTableSection 
          data={sections.comparison_table} 
          heading={t('pricing.compare_plans_heading')}
        />
      )}

      {/* FAQ Section */}
      {sections.faq && sections.faq.length > 0 && shouldRender('faq') && (
        <FAQSection 
          heading={t('faq.heading')} 
          items={sections.faq.map((f, idx) => ({
            id: String(idx),
            question: f.question,
            answer: f.answer
          }))} 
        />
      )}

      {/* CTA Section */}
      {sections.cta && shouldRender('cta') && (
        <CTASection
          title={sections.cta.title}
          description={sections.cta.subtitle}
          primaryCta={{ 
            label: sections.cta.primary_label, 
            href: sections.cta.primary_url 
          }}
          secondaryCta={{ 
            label: sections.cta.secondary_label, 
            href: sections.cta.secondary_url 
          }}
        />
      )}

      {/* Other potential sections from CMS */}
      {sections.workflow && shouldRender('workflow') && (
        <WorkflowSection 
          heading={sections.workflow.heading}
          steps={(sections.workflow.steps || []).map((step, idx) => ({
            id: step.id ? String(step.id) : `step-${idx}`,
            title: step.title,
            description: step.description
          }))}
        />
      )}

      {sections.detail_grid && shouldRender('detail_grid') && (
        <DetailGridSection 
          heading={sections.detail_grid.heading}
          items={(sections.detail_grid.items || []).map((item, idx) => ({
            id: item.id ? String(item.id) : `detail-${idx}`,
            title: item.title,
            description: item.description,
            icon: item.icon
          }))}
        />
      )}

      {sections.action_cards && shouldRender('action_cards') && (
        <ActionCardSection 
          heading={sections.action_cards.heading}
          items={(sections.action_cards.items || []).map((item, idx) => ({
            id: item.id ? String(item.id) : `action-${idx}`,
            icon: item.icon,
            title: item.title,
            description: item.description,
            href: item.url,
            ctaLabel: item.cta_label
          }))}
        />
      )}
    </>
  );
}