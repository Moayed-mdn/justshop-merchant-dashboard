import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import type { CmsContactMethod, CmsOfficeLocation, CmsSupportHours } from '@/types/cms'
import { useTranslations } from 'next-intl'

interface ContactInfoSectionProps {
  methods?: CmsContactMethod[]
  locations?: CmsOfficeLocation[]
  hours?: CmsSupportHours[]
}

export default function ContactInfoSection({
  methods = [],
  locations = [],
  hours = [],
}: ContactInfoSectionProps) {
  const t = useTranslations('marketing.sections.contact')

  return (
    <section className="py-24 bg-background border-y border-border/50">
      <SectionContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Contact Methods */}
          {methods.length > 0 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{t('methods_heading')}</h3>
                <p className="text-muted-foreground">{t('methods_subtext')}</p>
              </div>
              <div className="space-y-6">
                {methods.map((method, idx) => (
                  <div key={idx} className="flex flex-col group">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                      {method.label}
                    </span>
                    <a 
                      href={method.type === 'email' ? `mailto:${method.value}` : method.type === 'phone' ? `tel:${method.value}` : '#'}
                      className="text-lg font-semibold text-foreground hover:text-primary transition-colors break-all"
                    >
                      {method.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Office Locations */}
          {locations.length > 0 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{t('offices_heading')}</h3>
                <p className="text-muted-foreground">{t('offices_subtext')}</p>
              </div>
              <div className="space-y-6">
                {locations.map((location, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                      {location.city}
                    </span>
                    <span className="text-lg font-semibold text-foreground leading-snug">
                      {location.address}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Hours */}
          {hours.length > 0 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{t('hours_heading')}</h3>
                <p className="text-muted-foreground">{t('hours_subtext')}</p>
              </div>
              <div className="space-y-6">
                {hours.map((hour, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                      {hour.days}
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      {hour.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionContainer>
    </section>
  )
}
