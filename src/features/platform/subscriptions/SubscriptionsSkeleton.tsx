/**
 * Subscriptions table loading skeleton.
 */

export function SubscriptionsSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-8">
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            <div className="h-8 flex-1 animate-pulse rounded bg-muted" />
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
