'use client';

/**
 * Color Scheme Editor Dialog
 * Edit or create a color scheme
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPicker } from './ColorPicker';
import { toast } from 'sonner';
import type { ColorScheme } from '@/types/theme';

interface ColorSchemeEditorDialogProps {
  open: boolean;
  schemeKey: string;
  scheme: ColorScheme;
  isNew: boolean;
  existingKeys: string[];
  onSave: (key: string, scheme: ColorScheme) => void;
  onClose: () => void;
}

export function ColorSchemeEditorDialog({
  open,
  schemeKey,
  scheme,
  isNew,
  existingKeys,
  onSave,
  onClose,
}: ColorSchemeEditorDialogProps) {
  const [key, setKey] = useState(schemeKey);
  const [name, setName] = useState(scheme.name);
  const [background, setBackground] = useState(scheme.background);
  const [text, setText] = useState(scheme.text);
  const [buttonBackground, setButtonBackground] = useState(scheme.button_background);
  const [buttonText, setButtonText] = useState(scheme.button_text);
  const [secondaryBackground, setSecondaryBackground] = useState(scheme.secondary_background);
  const [border, setBorder] = useState(scheme.border);

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      toast.error('Scheme name is required');
      return;
    }

    if (!key.trim()) {
      toast.error('Scheme key is required');
      return;
    }

    // Check for duplicate keys (only for new schemes or if key changed)
    if (isNew || key !== schemeKey) {
      if (existingKeys.includes(key)) {
        toast.error(`A scheme with key "${key}" already exists`);
        return;
      }
    }

    // Validate key format (alphanumeric, underscores, hyphens only)
    if (!/^[a-z0-9_-]+$/i.test(key)) {
      toast.error('Key can only contain letters, numbers, underscores, and hyphens');
      return;
    }

    onSave(key, {
      name: name.trim(),
      background,
      text,
      button_background: buttonBackground,
      button_text: buttonText,
      secondary_background: secondaryBackground,
      border,
    });

    toast.success(isNew ? 'Color scheme created' : 'Color scheme updated');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create Color Scheme' : 'Edit Color Scheme'}</DialogTitle>
          <DialogDescription>
            Define a coordinated set of colors that can be applied to sections
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name and Key */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheme-name">Scheme Name</Label>
              <Input
                id="scheme-name"
                placeholder="e.g., Dark, Light, Brand"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Display name shown to users</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheme-key">Scheme Key</Label>
              <Input
                id="scheme-key"
                placeholder="e.g., dark, light, brand"
                value={key}
                onChange={(e) => setKey(e.target.value.toLowerCase())}
                disabled={!isNew && schemeKey === 'default'}
              />
              <p className="text-xs text-muted-foreground">Unique identifier (lowercase)</p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div
              className="rounded-lg p-6 border-2"
              style={{
                backgroundColor: background,
                color: text,
                borderColor: border,
              }}
            >
              <h3 className="text-lg font-semibold mb-2">Section Heading</h3>
              <p className="text-sm mb-4 opacity-90">
                This is how your section will look with this color scheme applied.
              </p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-lg font-medium text-sm"
                  style={{
                    backgroundColor: buttonBackground,
                    color: buttonText,
                  }}
                >
                  Primary Button
                </button>
                <div
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: secondaryBackground,
                    color: text,
                  }}
                >
                  Secondary Background
                </div>
              </div>
            </div>
          </div>

          {/* Color Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <ColorPicker value={background} onChange={setBackground} />
              <p className="text-xs text-muted-foreground">Main background color</p>
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <ColorPicker value={text} onChange={setText} />
              <p className="text-xs text-muted-foreground">Main text color</p>
            </div>

            <div className="space-y-2">
              <Label>Button Background</Label>
              <ColorPicker value={buttonBackground} onChange={setButtonBackground} />
              <p className="text-xs text-muted-foreground">Primary button color</p>
            </div>

            <div className="space-y-2">
              <Label>Button Text</Label>
              <ColorPicker value={buttonText} onChange={setButtonText} />
              <p className="text-xs text-muted-foreground">Button text color</p>
            </div>

            <div className="space-y-2">
              <Label>Secondary Background</Label>
              <ColorPicker value={secondaryBackground} onChange={setSecondaryBackground} />
              <p className="text-xs text-muted-foreground">Cards, accents</p>
            </div>

            <div className="space-y-2">
              <Label>Border Color</Label>
              <ColorPicker value={border} onChange={setBorder} />
              <p className="text-xs text-muted-foreground">Border and dividers</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isNew ? 'Create Scheme' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
