import type {
  GenerationStrategy,
  KeyframeRequirement,
  RegenerationMode,
  ShotState,
  ShotType,
  StoryboardLevel,
} from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const KEYFRAME_REQUIREMENT_LABEL: Record<
  KeyframeRequirement,
  TranslationKey
> = {
  NOT_REQUIRED: 'storyboard.requirement.NOT_REQUIRED',
  REQUIRED_BY_SUBJECT: 'storyboard.requirement.REQUIRED_BY_SUBJECT',
  REQUIRED_BY_USER: 'storyboard.requirement.REQUIRED_BY_USER',
};

export const STORYBOARD_LEVEL_LABEL: Record<StoryboardLevel, TranslationKey> = {
  DRAFT: 'storyboard.level.DRAFT',
  KEYFRAME: 'storyboard.level.KEYFRAME',
};

export const STORYBOARD_LEVEL_EXPLAINED: Record<
  StoryboardLevel,
  TranslationKey
> = {
  DRAFT: 'storyboard.level.DRAFT.explained',
  KEYFRAME: 'storyboard.level.KEYFRAME.explained',
};

export const REGENERATION_MODE_LABEL: Record<RegenerationMode, TranslationKey> =
  {
    SAME_PROMPT_NEW_SEED: 'storyboard.regeneration.SAME_PROMPT_NEW_SEED',
    CONTROLLED_PROMPT_REVISION:
      'storyboard.regeneration.CONTROLLED_PROMPT_REVISION',
    NEW_KEYFRAME: 'storyboard.regeneration.NEW_KEYFRAME',
    EXACT_REPLAY: 'storyboard.regeneration.EXACT_REPLAY',
    RETAKE_REGION: 'storyboard.regeneration.RETAKE_REGION',
  };

export const SHOT_TYPE_LABEL: Record<ShotType, TranslationKey> = {
  ESTABLISHING: 'storyboard.shotType.ESTABLISHING',
  WIDE: 'storyboard.shotType.WIDE',
  MEDIUM: 'storyboard.shotType.MEDIUM',
  CLOSE_UP: 'storyboard.shotType.CLOSE_UP',
  EXTREME_CLOSE_UP: 'storyboard.shotType.EXTREME_CLOSE_UP',
  OVER_SHOULDER: 'storyboard.shotType.OVER_SHOULDER',
  TWO_SHOT: 'storyboard.shotType.TWO_SHOT',
  POV: 'storyboard.shotType.POV',
  REACTION: 'storyboard.shotType.REACTION',
  INSERT: 'storyboard.shotType.INSERT',
  ACTION: 'storyboard.shotType.ACTION',
  TRACKING: 'storyboard.shotType.TRACKING',
  MONTAGE: 'storyboard.shotType.MONTAGE',
  TRANSITION: 'storyboard.shotType.TRANSITION',
  HOLD: 'storyboard.shotType.HOLD',
  LIMITED_ANIMATION: 'storyboard.shotType.LIMITED_ANIMATION',
};

export const SHOT_STATE_LABEL: Record<ShotState, TranslationKey> = {
  PLANNED: 'storyboard.state.PLANNED',
  STORYBOARD_PENDING: 'storyboard.state.STORYBOARD_PENDING',
  STORYBOARD_READY: 'storyboard.state.STORYBOARD_READY',
  STORYBOARD_APPROVED: 'storyboard.state.STORYBOARD_APPROVED',
  AUDIO_PENDING: 'storyboard.state.AUDIO_PENDING',
  AUDIO_READY: 'storyboard.state.AUDIO_READY',
  VIDEO_PENDING: 'storyboard.state.VIDEO_PENDING',
  VIDEO_RENDERING: 'storyboard.state.VIDEO_RENDERING',
  VIDEO_READY: 'storyboard.state.VIDEO_READY',
  AUTO_QC: 'storyboard.state.AUTO_QC',
  MANUAL_REVIEW: 'storyboard.state.MANUAL_REVIEW',
  APPROVED: 'storyboard.state.APPROVED',
  REJECTED: 'storyboard.state.REJECTED',
  RENDER_FAILED: 'storyboard.state.RENDER_FAILED',
  ASSEMBLED: 'storyboard.state.ASSEMBLED',
};

export const GENERATION_STRATEGY_LABEL: Record<
  GenerationStrategy,
  TranslationKey
> = {
  TEXT_TO_VIDEO_ENVIRONMENT: 'storyboard.strategy.TEXT_TO_VIDEO_ENVIRONMENT',
  IMAGE_TO_VIDEO: 'storyboard.strategy.IMAGE_TO_VIDEO',
  KEYFRAME_INTERPOLATION: 'storyboard.strategy.KEYFRAME_INTERPOLATION',
  LIMITED_ANIMATION_PAN: 'storyboard.strategy.LIMITED_ANIMATION_PAN',
  LIMITED_ANIMATION_HOLD: 'storyboard.strategy.LIMITED_ANIMATION_HOLD',
  REUSE_APPROVED_CLIP: 'storyboard.strategy.REUSE_APPROVED_CLIP',
  DFR_ACTION: 'storyboard.strategy.DFR_ACTION',
  AUDIO_TO_VIDEO: 'storyboard.strategy.AUDIO_TO_VIDEO',
  VIDEO_RETAKE: 'storyboard.strategy.VIDEO_RETAKE',
};

export const STRATEGIES_NEEDING_NO_KEYFRAME: ReadonlySet<GenerationStrategy> =
  new Set<GenerationStrategy>([
    'REUSE_APPROVED_CLIP',
    'LIMITED_ANIMATION_HOLD',
  ]);

export const FRAME_ANCHOR_KIND_LABEL: Record<
  'SUBJECT' | 'LOCATION_PLATE' | 'PROP',
  TranslationKey
> = {
  SUBJECT: 'storyboard.compare.anchor.SUBJECT',
  LOCATION_PLATE: 'storyboard.compare.anchor.LOCATION_PLATE',
  PROP: 'storyboard.compare.anchor.PROP',
};
