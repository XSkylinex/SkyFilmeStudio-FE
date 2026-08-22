import type {
  NarrativeMode,
  ProductionKind,
  ProductionState,
} from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const PRODUCTION_CARD_SKELETON_COUNT = 3;

export const PRODUCTION_KIND_LABEL = {
  EPISODE: 'productions.kind.EPISODE',
  SHORT_FILM: 'productions.kind.SHORT_FILM',
  FILM: 'productions.kind.FILM',
  MUSIC_VIDEO: 'productions.kind.MUSIC_VIDEO',
  TRAILER: 'productions.kind.TRAILER',
  MONTAGE: 'productions.kind.MONTAGE',
  NARRATED_STORY: 'productions.kind.NARRATED_STORY',
  CUSTOM: 'productions.kind.CUSTOM',
} satisfies Record<ProductionKind, TranslationKey>;

export const NARRATIVE_MODE_LABEL = {
  SCREENPLAY: 'productions.mode.SCREENPLAY',
  TREATMENT: 'productions.mode.TREATMENT',
  MUSIC_DRIVEN: 'productions.mode.MUSIC_DRIVEN',
  VISUAL_ONLY: 'productions.mode.VISUAL_ONLY',
  IMPORTED_TIMELINE: 'productions.mode.IMPORTED_TIMELINE',
  CUSTOM: 'productions.mode.CUSTOM',
} satisfies Record<NarrativeMode, TranslationKey>;

export const PRODUCTION_STATE_LABEL = {
  IDEA: 'productions.state.IDEA',
  OUTLINE_DRAFT: 'productions.state.OUTLINE_DRAFT',
  OUTLINE_APPROVED: 'productions.state.OUTLINE_APPROVED',
  SCREENPLAY_DRAFT: 'productions.state.SCREENPLAY_DRAFT',
  SCREENPLAY_APPROVED: 'productions.state.SCREENPLAY_APPROVED',
  PLANNING: 'productions.state.PLANNING',
  STORYBOARDING: 'productions.state.STORYBOARDING',
  STORYBOARD_REVIEW: 'productions.state.STORYBOARD_REVIEW',
  AUDIO_RENDER: 'productions.state.AUDIO_RENDER',
  VIDEO_RENDER: 'productions.state.VIDEO_RENDER',
  SHOT_REVIEW: 'productions.state.SHOT_REVIEW',
  ASSEMBLY: 'productions.state.ASSEMBLY',
  FINAL_QC: 'productions.state.FINAL_QC',
  COMPLETE: 'productions.state.COMPLETE',
  ARCHIVED: 'productions.state.ARCHIVED',
} satisfies Record<ProductionState, TranslationKey>;
