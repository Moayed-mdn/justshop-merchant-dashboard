import type { ContentSectionProps } from '@/types/runtime';

export default function ContentSection({ title, subtitle, content }: ContentSectionProps) {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {title && (
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        )}
        {subtitle && (
          <p className="text-lg text-muted-foreground mb-6">{subtitle}</p>
        )}
        {content && (
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}
