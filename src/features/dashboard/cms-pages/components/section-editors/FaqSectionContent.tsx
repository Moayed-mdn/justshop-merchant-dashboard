'use client';

/**
 * FAQ section content editor.
 * Reads: content.items[] { question (localized), answer (localized) }
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { RepeaterField } from '../RepeaterField';
import { LocalizedTextField } from '../LocalizedTextField';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface FaqSectionContentProps {
  index: number;
}

type FaqItem = {
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
};

export function FaqSectionContent({ index }: FaqSectionContentProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue } = useFormContext<MarketingPageFormValues>();

  const basePath = `sections.${index}.content`;
  const items = (watch(`${basePath}.items` as any) ?? []) as FaqItem[];

  const handleAdd = () => {
    setValue(`${basePath}.items` as any, [
      ...items,
      { question: { en: '', ar: '' }, answer: { en: '', ar: '' } },
    ], { shouldDirty: true });
  };

  const handleRemove = (itemIndex: number) => {
    setValue(`${basePath}.items` as any, items.filter((_, i) => i !== itemIndex), { shouldDirty: true });
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setValue(`${basePath}.items` as any, updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.faq.heading')}
      </h4>

      <RepeaterField
        items={items}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onMoveUp={(i) => i > 0 && handleMove(i, i - 1)}
        onMoveDown={(i) => i < items.length - 1 && handleMove(i, i + 1)}
        getItemLabel={(item: any, i) => item?.question?.en || `Question ${i + 1}`}
        addLabel={t('sections.editors.faq.addQuestion')}
        emptyLabel={t('sections.editors.faq.noQuestions')}
        renderItem={(itemIndex) => (
          <div className="space-y-3">
            {/* Question (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.faq.question')}</Label>
              <LocalizedTextField
                name={`${basePath}.items.${itemIndex}.question`}
                placeholder={{ en: 'Question', ar: 'السؤال' }}
              />
            </div>

            {/* Answer (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.faq.answer')}</Label>
              <LocalizedTextField
                name={`${basePath}.items.${itemIndex}.answer`}
                placeholder={{ en: 'Answer', ar: 'الإجابة' }}
                multiline
                rows={4}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
