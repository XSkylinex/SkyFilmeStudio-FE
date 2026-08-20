import type {
  ModelFileStatusValue,
  ModelRole,
} from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const MODEL_ROLE_LABEL_KEY = {
  VIDEO: 'system.models.role.VIDEO',
  IMAGE: 'system.models.role.IMAGE',
  IMAGE_EDIT: 'system.models.role.IMAGE_EDIT',
  TEXT: 'system.models.role.TEXT',
  TTS: 'system.models.role.TTS',
  MUSIC: 'system.models.role.MUSIC',
} satisfies Record<ModelRole, TranslationKey>;

export const MODEL_FILE_STATUS_LABEL_KEY = {
  VERIFIED: 'system.models.fileStatus.VERIFIED',
  PRESENT_UNVERIFIABLE: 'system.models.fileStatus.PRESENT_UNVERIFIABLE',
  MISSING: 'system.models.fileStatus.MISSING',
  SIZE_MISMATCH: 'system.models.fileStatus.SIZE_MISMATCH',
  HASH_MISMATCH: 'system.models.fileStatus.HASH_MISMATCH',
  UNREADABLE: 'system.models.fileStatus.UNREADABLE',
} satisfies Record<ModelFileStatusValue, TranslationKey>;
