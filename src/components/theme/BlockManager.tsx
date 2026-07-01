'use client';

import { Button } from '@/components/ui/button';
import {
  Eye, EyeOff, ChevronUp, ChevronDown, Settings,
} from 'lucide-react';
import { BLOCK_TYPE_LABELS } from '@/types/theme';
import type { ThemeBlock } from '@/types/theme';

interface BlockManagerProps {
  blocks: ThemeBlock[];
  onToggle?: (blockId: number, isEnabled: boolean) => void;
  onMove?: (blockId: number, direction: 'up' | 'down') => void;
  onConfigure?: (block: ThemeBlock) => void;
  isPending?: boolean;
}

export function BlockManager({
  blocks,
  onToggle,
  onMove,
  onConfigure,
  isPending,
}: BlockManagerProps) {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-1">
      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          No blocks in this section
        </p>
      )}
      {sorted.map((block, idx) => (
        <div
          key={block.id}
          className="flex items-center gap-2 rounded-lg border p-2"
        >
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              disabled={idx === 0 || isPending}
              onClick={() => onMove?.(block.id, 'up')}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              disabled={idx === sorted.length - 1 || isPending}
              onClick={() => onMove?.(block.id, 'down')}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium truncate">
                {BLOCK_TYPE_LABELS[block.type] ?? block.type}
              </span>
              {block.name && (
                <span className="text-xs text-muted-foreground truncate">
                  {block.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onConfigure && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onConfigure(block)}
              >
                <Settings className="h-3 w-3" />
              </Button>
            )}
            {onToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={isPending}
                onClick={() => onToggle(block.id, !block.is_enabled)}
              >
                {block.is_enabled ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
