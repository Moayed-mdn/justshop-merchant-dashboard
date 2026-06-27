import type { PageContentSectionProps } from '@/types/runtime';

export default function PageContentSection({ title, content }: PageContentSectionProps) {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {title && (
          <h1 className="text-3xl font-bold mb-6">{title}</h1>
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
