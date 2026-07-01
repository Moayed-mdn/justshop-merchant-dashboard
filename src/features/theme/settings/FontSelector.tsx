'use client';

/**
 * Font selector component.
 * Dropdown selector for Google Fonts with preview.
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GOOGLE_FONTS } from '@/lib/fonts';

interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const handleChange = (newValue: string | null) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {GOOGLE_FONTS.map((font) => (
          <SelectItem
            key={font.value}
            value={font.value}
            style={{ fontFamily: font.value }}
          >
            {font.name}
            <span className="text-xs text-muted-foreground ml-2">
              ({font.category})
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
