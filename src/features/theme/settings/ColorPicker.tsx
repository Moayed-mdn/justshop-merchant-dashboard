'use client';

/**
 * Color picker component.
 * Allows selecting colors with HEX input and visual preview.
 */

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Validate HEX color
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-12 h-10 p-0 border-2"
            style={{ backgroundColor: value }}
          >
            <span className="sr-only">Pick color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Color Picker</label>
              <input
                type="color"
                value={value}
                onChange={handleColorChange}
                className="w-full h-32 cursor-pointer rounded border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">HEX Value</label>
              <Input
                value={localValue}
                onChange={handleInputChange}
                placeholder="#000000"
                className="font-mono"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Input
        value={localValue}
        onChange={handleInputChange}
        placeholder="#000000"
        className="flex-1 font-mono"
      />
    </div>
  );
}
