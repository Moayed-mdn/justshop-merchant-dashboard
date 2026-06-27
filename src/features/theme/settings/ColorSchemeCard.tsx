'use client';

/**
 * Color Scheme Card Component
 * Displays a single color scheme with preview
 */

import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ColorScheme } from '@/types/theme';

interface ColorSchemeCardProps {
  schemeKey: string;
  scheme: ColorScheme;
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

export function ColorSchemeCard({ schemeKey, scheme, onEdit, onDelete, canDelete }: ColorSchemeCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{scheme.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Key: {schemeKey}</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onEdit}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Preview Section */}
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: scheme.background,
            color: scheme.text,
            borderColor: scheme.border,
          }}
        >
          <p className="text-sm font-medium mb-2">Preview</p>
          <p className="text-xs mb-3 opacity-80">This is how text appears</p>
          <button
            className="text-xs px-3 py-1.5 rounded-md font-medium"
            style={{
              backgroundColor: scheme.button_background,
              color: scheme.button_text,
            }}
          >
            Button
          </button>
        </div>

        {/* Color Swatches */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <div
              className="h-8 rounded border"
              style={{ backgroundColor: scheme.background }}
              title="Background"
            />
            <p className="text-[10px] text-muted-foreground truncate">Background</p>
          </div>
          <div className="space-y-1">
            <div
              className="h-8 rounded border flex items-center justify-center"
              style={{ backgroundColor: scheme.text }}
              title="Text"
            >
              <span className="text-[8px] font-bold" style={{ color: scheme.background }}>A</span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">Text</p>
          </div>
          <div className="space-y-1">
            <div
              className="h-8 rounded border"
              style={{ backgroundColor: scheme.button_background }}
              title="Button"
            />
            <p className="text-[10px] text-muted-foreground truncate">Button</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
