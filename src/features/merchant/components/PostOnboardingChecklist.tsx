'use client';

import { useCallback, useState } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import {
  Package,
  FolderTree,
  Palette,
  Settings,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CHECKLIST_KEY_PREFIX = 'merchant.post-onboarding-checklist';

interface ChecklistItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const ITEMS: ChecklistItem[] = [
  {
    id: 'add-product',
    label: 'Add your first product',
    icon: Package,
    href: ROUTES.merchant.products.new(),
  },
  {
    id: 'create-category',
    label: 'Create a category',
    icon: FolderTree,
    href: ROUTES.merchant.categories.new(),
  },
  {
    id: 'customize-theme',
    label: 'Customize your storefront',
    icon: Palette,
    href: ROUTES.merchant.theme.overview(),
  },
  {
    id: 'review-settings',
    label: 'Review store settings',
    icon: Settings,
    href: ROUTES.merchant.settings(),
  },
];

interface ChecklistState {
  dismissed: boolean;
  completedItems: string[];
}

function loadState(storeId: string): ChecklistState {
  if (typeof window === 'undefined') return { dismissed: false, completedItems: [] };
  try {
    const raw = localStorage.getItem(`${CHECKLIST_KEY_PREFIX}-${storeId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        const state = {
          dismissed: Boolean(parsed.dismissed),
          completedItems: Array.isArray(parsed.completedItems) ? parsed.completedItems : [],
        };
        if (state.completedItems.length >= ITEMS.length) {
          state.dismissed = true;
        }
        return state;
      }
    }
  } catch { /* ignore */ }
  return { dismissed: false, completedItems: [] };
}

function saveState(storeId: string, { dismissed, completedItems }: ChecklistState) {
  try {
    localStorage.setItem(
      `${CHECKLIST_KEY_PREFIX}-${storeId}`,
      JSON.stringify({ dismissed, completedItems }),
    );
  } catch { /* ignore */ }
}

export function PostOnboardingChecklist() {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const onboarding = useBootstrapStore((state) => state.onboarding);
  const storeId = String(activeStore?.id ?? '');

  const [state, setState] = useState<ChecklistState>(() => loadState(storeId));

  const persist = useCallback(
    (next: ChecklistState) => {
      setState(next);
      saveState(storeId, next);
    },
    [storeId],
  );

  const dismiss = useCallback(() => {
    persist({ dismissed: true, completedItems: state.completedItems });
  }, [persist, state.completedItems]);

  const toggleItem = useCallback(
    (id: string) => {
      const completed = state.completedItems.includes(id)
        ? state.completedItems.filter((i) => i !== id)
        : [...state.completedItems, id];
      const dismissed = completed.length >= ITEMS.length;
      persist({ dismissed, completedItems: completed });
    },
    [persist, state.completedItems],
  );

  const completedCount = state.completedItems.length;
  const totalCount = ITEMS.length;

  if (state.dismissed) return null;
  if (!storeId || !onboarding?.is_completed) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <h3 className="text-sm font-semibold">Getting started</h3>
          <p className="text-xs text-muted-foreground">
            {completedCount} of {totalCount} complete
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Hide this
        </button>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="space-y-2">
          {ITEMS.map((item) => {
            const done = state.completedItems.includes(item.id);
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50',
                    done && 'text-muted-foreground',
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className="shrink-0 focus:outline-none"
                    aria-label={done ? `Mark "${item.label}" as incomplete` : `Mark "${item.label}" as complete`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className={cn(done && 'line-through')}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
