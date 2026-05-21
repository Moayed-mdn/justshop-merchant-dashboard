import { cn } from '@/lib/utils';

interface CmsContentProps {
  content: string;
  className?: string;
}

/**
 * Renders CMS HTML content safely with consistent styling
 */
export function CmsContent({ content, className }: CmsContentProps) {
  if (!content) return null;

  return (
    <div
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none break-words',
        'prose-headings:font-bold prose-headings:tracking-tight',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto',
        'prose-table:overflow-x-auto prose-table:block prose-table:whitespace-nowrap md:prose-table:table md:prose-table:whitespace-normal',
        'prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto',
        // RTL Support
        'rtl:prose-headings:text-right rtl:prose-p:text-right rtl:prose-li:text-right rtl:text-right',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
