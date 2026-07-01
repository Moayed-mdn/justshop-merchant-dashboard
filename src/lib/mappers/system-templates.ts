import type {
  SystemTemplate,
  SystemTemplateView,
  SystemTemplateSection,
  SystemTemplateSectionView,
} from '@/types/theme';

export function mapSystemTemplateSection(section: SystemTemplateSection): SystemTemplateSectionView {
  return {
    id: section.id,
    sectionType: section.section_type,
    position: section.position,
    overrides: section.overrides,
    settings: section.settings,
    isVisible: section.is_visible,
    blocks: section.blocks,
  };
}

export function mapSystemTemplate(item: SystemTemplate): SystemTemplateView {
  return {
    id: item.id,
    themeId: item.theme_id,
    themeSlug: item.theme_slug,
    themeIdentifier: item.theme_identifier,
    name: item.name,
    handle: item.handle,
    type: item.type,
    typeLabel: item.type_label,
    description: item.description,
    settings: item.settings,
    isDefault: item.is_default,
    sections: (item.sections ?? []).map(mapSystemTemplateSection),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}
