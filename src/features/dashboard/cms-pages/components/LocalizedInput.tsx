'use client';

/**
 * Localized text input component.
 * Renders a tabbed interface for editing locale-keyed string values.
 * Follows the same locale-tab pattern used in the product editor.
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { LocalizedString } from '@/types/marketing-page';

const LOCALES = [
  { code: 'en', label: 'English', dir: 'ltr' as const },
  { code: 'ar', label: 'العربية', dir: 'rtl' as const },
];

interface LocalizedInputProps {
  value:       LocalizedString;
  onChange:    (next: LocalizedString) => void;
  placeholder?: Partial<Record<string, string>>;
  multiline?:  boolean;
  rows?:       number;
  id?:         string;
}

export function LocalizedInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  id,
}: LocalizedInputProps) {
  const [activeLocale, setActiveLocale] = useState('en');

  const handleChange = (locale: string, text: string) => {
    onChange({ ...value, [locale]: text });
  };

  return (
    <Tabs value={activeLocale} onValueChange={setActiveLocale}>
      <TabsList className="h-8">
        {LOCALES.map((locale) => (
          <TabsTrigger key={locale.code} value={locale.code} className="text-xs px-3 h-7">
            {locale.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {LOCALES.map((locale) => (
        <TabsContent key={locale.code} value={locale.code} className="mt-2">
          {multiline ? (
            <Textarea
              id={id ? `${id}-${locale.code}` : undefined}
              value={value[locale.code] ?? ''}
              onChange={(e) => handleChange(locale.code, e.target.value)}
              placeholder={placeholder?.[locale.code] ?? ''}
              dir={locale.dir}
              rows={rows}
            />
          ) : (
            <Input
              id={id ? `${id}-${locale.code}` : undefined}
              value={value[locale.code] ?? ''}
              onChange={(e) => handleChange(locale.code, e.target.value)}
              placeholder={placeholder?.[locale.code] ?? ''}
              dir={locale.dir}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
