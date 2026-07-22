'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const menuItems = menu ?? [];
  const name = storeName ?? 'Store';
  const sticky = (settings?.sticky as boolean) ?? true;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`w-full border-b bg-background ${sticky ? 'sticky top-0 z-50' : ''}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {logoUrl ? (
            <Image src={logoUrl} alt={name} width={120} height={32} className="h-8 w-auto" unoptimized />
          ) : (
            <span className="font-bold text-xl tracking-tight">{name}</span>
          )}
        </Link>
        
        <nav className="hidden md:block flex-shrink-0">
          <ul className="flex items-center gap-1">
            {menuItems.map((item) => renderNavItem(item))}
          </ul>
        </nav>
        
        <div className="flex items-center gap-4 flex-1 justify-end">
          <form onSubmit={handleSearch} className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </form>
          
          <Link href="/cart" className="p-2 text-sm font-medium hover:text-primary transition-colors flex-shrink-0">
            Cart
          </Link>
        </div>
      </div>
    </header>
  );
}
