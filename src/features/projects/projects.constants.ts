import type { ProjectKind } from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const PROJECT_KIND_LABEL_KEY = {
  SERIES: 'projects.kind.SERIES',
  STANDALONE: 'projects.kind.STANDALONE',
  MUSIC: 'projects.kind.MUSIC',
  EXPERIMENTAL: 'projects.kind.EXPERIMENTAL',
  CUSTOM: 'projects.kind.CUSTOM',
} satisfies Record<ProjectKind, TranslationKey>;

export const PROJECT_LIST_SKELETON_COUNT = 3;
