import type { ReactNode } from 'react';

interface MerchantPageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function MerchantPageHeader({ title, description, children }: MerchantPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex shrink-0 items-center gap-3">{children}</div>
      ) : null}
    </div>
  );
}
