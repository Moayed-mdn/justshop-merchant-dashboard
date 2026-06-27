'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SectionSchema } from '@/types/theme';

interface AddSectionDialogProps {
  schemas: SectionSchema[];
  onClose: () => void;
  onAdd: (type: string, identifier: string) => void;
}

export function AddSectionDialog({ schemas, onClose, onAdd }: AddSectionDialogProps) {
  const t = useTranslations();
  const [selectedType, setSelectedType] = useState(schemas[0]?.type ?? '');
  const [identifier, setIdentifier] = useState('');

  const selectedSchema = schemas.find((s) => s.type === selectedType);

  const handleAdd = () => {
    if (!selectedType) return;
    const id = identifier.trim() || `${selectedType}-${Date.now()}`;
    onAdd(selectedType, id);
  };

  const categories = Array.from(new Set(schemas.map((s) => s.category)));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('theme.templates.customizer.addSection')}</DialogTitle>
          <DialogDescription>
            {t('theme.templates.customizer.addSectionDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t('theme.templates.customizer.sectionType')}</Label>
            <Select value={selectedType} onValueChange={(v) => v !== null && setSelectedType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {schemas.map((schema) => (
                  <SelectItem key={schema.type} value={schema.type}>
                    {schema.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSchema?.description && (
            <p className="text-sm text-muted-foreground">{selectedSchema.description}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="section-identifier">
              {t('theme.templates.customizer.sectionIdentifier')}
            </Label>
            <Input
              id="section-identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={t('theme.templates.customizer.identifierPlaceholder')}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleAdd} disabled={!selectedType}>
            {t('theme.templates.customizer.addSection')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
