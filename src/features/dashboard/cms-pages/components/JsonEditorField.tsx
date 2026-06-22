'use client';

/**
 * JSON editor field with validation.
 * Used by Custom section editor for raw content/settings editing.
 */

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface JsonEditorFieldProps {
  label: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  rows?: number;
}

export function JsonEditorField({
  label,
  value,
  onChange,
  rows = 8,
}: JsonEditorFieldProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize text from value
  useEffect(() => {
    try {
      setText(JSON.stringify(value, null, 2));
    } catch {
      setText('{}');
    }
  }, []); // Only on mount

  const handleChange = (newText: string) => {
    setText(newText);

    try {
      const parsed = JSON.parse(newText);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        setError(null);
        onChange(parsed);
      } else {
        setError('Must be a JSON object');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={rows}
        className="font-mono text-xs"
        placeholder="{}"
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
