import Link from 'next/link';
import type { FooterSectionProps, NavigationItem } from '@/types/runtime';

export default function FooterLegalSection({ menu, storeName, copyrightYear }: FooterSectionProps) {
  const year = copyrightYear ?? new Date().getFullYear();
  const name = storeName ?? 'Your Store';

  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {year} {name}. All rights reserved.
        </p>
        {menu && menu.length > 0 && (
          <nav>
            <ul className="flex items-center gap-4">
              {menu.map((item: NavigationItem) => (
                <li key={item.id}>
                  {item.external ? (
                    <a href={item.path} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </footer>
  );
}
