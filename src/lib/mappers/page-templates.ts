import type {
  PageTemplate,
  PageTemplateView,
} from '@/types/theme';

export function mapPageTemplate(item: PageTemplate): PageTemplateView {
  return {
    id: item.id,
    storeId: item.store_id,
    name: item.name,
    handle: item.handle,
    type: item.type,
    description: item.description,
    sections: item.sections,
    sectionOrder: item.section_order,
    sectionSettings: item.section_settings,
    isDefault: item.is_default,
    isActive: item.is_active,
    pagesCount: item.pages_count ?? 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}
