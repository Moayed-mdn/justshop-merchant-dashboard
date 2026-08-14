/**
 * Subscription events timeline.
 * Shows status-change audit trail for debugging/support.
 */

import { useTranslations } from 'next-intl';
import type { SubscriptionDetailView } from '@/types/billing/subscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface Props {
  subscription: SubscriptionDetailView;
}

export function SubscriptionEvents({ subscription }: Props) {
  const t = useTranslations('subscriptions.detail.events');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {subscription.events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t('empty')}</p>
        ) : (
          <div className="space-y-4">
            {subscription.events.map((event, index) => (
              <div
                key={event.id}
                className="relative flex gap-4 pb-4 last:pb-0"
              >
                {/* Timeline line */}
                {index < subscription.events.length - 1 && (
                  <div className="absolute left-2 top-8 h-full w-0.5 bg-border" />
                )}
                
                {/* Timeline dot */}
                <div className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary mt-1" />
                
                {/* Event content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {event.fromStatus && event.toStatus ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{event.fromStatus}</Badge>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="outline">{event.toStatus}</Badge>
                      </div>
                    ) : (
                      <Badge variant="outline">{event.eventType}</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {event.createdAtRelative}
                    </span>
                  </div>
                  
                  {event.reason && (
                    <p className="text-sm text-muted-foreground">{event.reason}</p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {event.source && (
                      <span>
                        {t('source')}: <span className="font-medium">{event.source}</span>
                      </span>
                    )}
                    {event.actor && (
                      <span>
                        • {t('actor')}: <span className="font-medium">{event.actor}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
