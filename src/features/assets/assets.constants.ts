import type {
  Origin,
  PrivacyClass,
  SourceAssetType,
} from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const ASSET_TYPE_LABEL_KEY = {
  IMAGE: 'assets.type.IMAGE',
  VIDEO: 'assets.type.VIDEO',
  AUDIO: 'assets.type.AUDIO',
  DRAWING: 'assets.type.DRAWING',
  RENDER_3D: 'assets.type.RENDER_3D',
  DOCUMENT: 'assets.type.DOCUMENT',
  OTHER: 'assets.type.OTHER',
} satisfies Record<SourceAssetType, TranslationKey>;

export const ASSET_ORIGIN_LABEL_KEY = {
  CAMERA_CAPTURE: 'assets.origin.CAMERA_CAPTURE',
  IMPORTED: 'assets.origin.IMPORTED',
  LOCALLY_GENERATED: 'assets.origin.LOCALLY_GENERATED',
  DERIVED: 'assets.origin.DERIVED',
} satisfies Record<Origin, TranslationKey>;

export const ASSET_PRIVACY_LABEL_KEY = {
  PROJECT_PRIVATE: 'assets.privacy.PROJECT_PRIVATE',
  EXPORTABLE: 'assets.privacy.EXPORTABLE',
} satisfies Record<PrivacyClass, TranslationKey>;

export const ASSET_GRID_SKELETON_COUNT = 6;
