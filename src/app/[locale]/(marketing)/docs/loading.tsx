import { Skeleton } from '@/components/ui/skeleton';

export default function DocsLoading() {
  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <div className="mb-10">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-48" />
      </div>
      
      <div className="space-y-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
