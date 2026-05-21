import SectionContainer from '@/features/marketing/layouts/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-muted/30 py-20">
        <SectionContainer>
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </SectionContainer>
      </div>
      
      <SectionContainer className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
