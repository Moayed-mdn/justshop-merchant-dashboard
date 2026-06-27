import type { FooterSectionProps } from '@/types/runtime';

export default function FooterMinimalSection({ storeName, copyrightYear }: FooterSectionProps) {
  const year = copyrightYear ?? new Date().getFullYear();
  const name = storeName ?? 'Your Store';

  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {year} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
