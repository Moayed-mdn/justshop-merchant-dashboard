'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DocumentationSidebar, DocumentationSidebarNode } from '@/types/cms';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DocsSidebarProps {
  sidebar: DocumentationSidebar;
  locale: string;
}

export function DocsSidebar({ sidebar, locale }: DocsSidebarProps) {
  return (
    <nav className="space-y-1">
      {sidebar.items.map((node) => (
        <SidebarNode key={node.id} node={node} locale={locale} depth={0} />
      ))}
    </nav>
  );
}

function SidebarNode({
  node,
  locale,
  depth,
}: {
  node: DocumentationSidebarNode;
  locale: string;
  depth: number;
}) {
  const pathname = usePathname();
  const href = `/${locale}/docs/${node.slug_path}`;
  const isActive = pathname === href;
  const hasChildren = node.children && node.children.length > 0;
  
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-1">
      <div className="flex items-center group">
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-muted rounded text-muted-foreground transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        <Link
          href={href}
          className={cn(
            'flex-1 px-2 py-1.5 text-sm font-medium rounded-md transition-colors',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {node.title}
        </Link>
      </div>

      {hasChildren && isOpen && (
        <div className="ml-4 border-l pl-2 space-y-1">
          {node.children.map((child) => (
            <SidebarNode key={child.id} node={child} locale={locale} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
