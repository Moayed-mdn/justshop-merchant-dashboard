'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { HeaderSectionProps, NavigationItem } from '@/types/runtime';

function renderNavItem(item: NavigationItem, depth: number = 0): React.ReactNode {
  return (
    <li key={item.id} className={depth === 0 ? 'relative group' : ''}>
      {item.external ? (
        <a
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-4 py-2 text-sm hover:text-primary transition-colors"
        >
          {item.label}
        </a>
      ) : (
        <Link
          href={item.path}
          className="block px-4 py-2 text-sm hover:text-primary transition-colors"
        >
          {item.label}
        </Link>
      )}
      {item.children.length > 0 && (
        <ul className={depth === 0 ? 'absolute left-0 top-full hidden group-hover:block bg-background border rounded-lg shadow-lg min-w-[200px] z-50' : 'pl-4'}>
          {item.children.map((child) => renderNavItem(child, depth + 1))}
        </ul>
      )}
    </li>
  );
}

export default function HeaderSection({ menu, logoUrl, storeName, settings }: HeaderSectionProps) {
  const menuItems = menu ?? [];
  const name = storeName ?? 'Store';
  const sticky = (settings?.sticky as boolean) ?? true;

  return (
    <header className={`w-full border-b bg-background ${sticky ? 'sticky top-0 z-50' : ''}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={name} width={120} height={32} className="h-8 w-auto" unoptimized />
          ) : (
            <span className="font-bold text-xl tracking-tight">{name}</span>
          )}
        </Link>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {menuItems.map((item) => renderNavItem(item))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="p-2 text-sm font-medium hover:text-primary transition-colors">
            Cart
          </Link>
        </div>
      </div>
    </header>
  );
}
