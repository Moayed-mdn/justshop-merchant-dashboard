import { getLocale } from 'next-intl/server';
import { cmsService } from '@/services/cms/cms.service';
import { DocsSidebar } from '@/features/cms/docs/components/DocsSidebar';
import SectionContainer from '@/features/marketing/layouts/SectionContainer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const sidebar = await cmsService.getDocsSidebar();

  const SidebarContent = () => (
    <div className="space-y-4">
      <h4 className="font-bold px-2 uppercase text-xs tracking-wider text-muted-foreground">
        Documentation
      </h4>
      <div className="overflow-y-auto pr-2">
        <DocsSidebar sidebar={sidebar} locale={locale} />
      </div>
    </div>
  );

  return (
    <div className="border-b">
      <SectionContainer className="flex flex-col md:flex-row gap-8 py-10">
        {/* Mobile Sidebar */}
        <div className="md:hidden mb-6">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Menu className="h-4 w-4" />
                  Documentation Menu
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 pt-12">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <SidebarContent />
          </div>
        </aside>
        
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </SectionContainer>
    </div>
  );
}
