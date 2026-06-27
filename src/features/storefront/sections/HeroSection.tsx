import type { HeroSectionProps } from '@/types/runtime';

export default function HeroSection({ title, subtitle, content, settings }: HeroSectionProps) {
  const align = (settings?.textAlign as string) ?? 'center';
  const bgColor = (settings?.backgroundColor as string) ?? '';
  const textColor = (settings?.textColor as string) ?? '';
  const imageUrl = content?.image_url ?? (settings?.imageUrl as string) ?? '';

  return (
    <section
      className="w-full py-20 sm:py-28"
      style={{
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4">
        <div className={`max-w-2xl mx-auto ${align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right'}`}>
          {title && (
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground mb-8">
              {subtitle}
            </p>
          )}
          {content?.heading && (
            <h2 className="text-2xl font-semibold mb-2">{content.heading}</h2>
          )}
          {content?.text && (
            <p className="text-base text-muted-foreground">{content.text}</p>
          )}
        </div>
      </div>
    </section>
  );
}
