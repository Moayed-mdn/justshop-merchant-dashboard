import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { cmsService } from '@/services/cms/cms.service';

export default async function DocsRootPage() {
  const locale = await getLocale();
  
  try {
    const sidebar = await cmsService.getDocsSidebar();
    if (sidebar.items.length > 0) {
      const firstPage = sidebar.items[0];
      redirect(`/${locale}/docs/${firstPage.slug_path}`);
    }
  } catch (error) {
    console.error('Failed to load docs sidebar', error);
  }

  // Fallback if no docs found
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold">Documentation</h1>
      <p className="text-muted-foreground mt-2">No documentation found.</p>
    </div>
  );
}
