import Link from 'next/link';
import type { CtaSectionProps } from '@/types/runtime';

export default function CtaSection({ title, subtitle, buttonLabel, buttonUrl, settings }: CtaSectionProps) {
  const bgColor = (settings?.backgroundColor as string) ?? '';
  const btnVariant = (settings?.buttonVariant as string) ?? 'primary';

  return (
    <section className="w-full py-16" style={{ backgroundColor: bgColor || undefined }}>
      <div className="container mx-auto px-4 text-center">
        {title && (
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        )}
        {subtitle && (
          <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>
        )}
        {buttonLabel && buttonUrl && (
          <Link
            href={buttonUrl}
            className={`inline-flex items-center justify-center h-11 px-8 rounded-md text-sm font-medium transition-colors ${
              btnVariant === 'secondary'
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
