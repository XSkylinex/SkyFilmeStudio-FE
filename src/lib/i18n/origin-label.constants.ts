import type { Origin } from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const ORIGIN_LABEL_KEY = {
  CAMERA_CAPTURE: 'origin.CAMERA_CAPTURE',
  IMPORTED: 'origin.IMPORTED',
  LOCALLY_GENERATED: 'origin.LOCALLY_GENERATED',
  DERIVED: 'origin.DERIVED',
} satisfies Record<Origin, TranslationKey>;
