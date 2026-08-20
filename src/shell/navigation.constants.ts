import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import type { ProductionStageId } from './interfaces/production-stage-id';
import type { ProductionStageState } from './interfaces/production-stage-state';

export const PRODUCTION_STAGE_ID = {
  SCREENPLAY: 'screenplay',
  MUSIC_PLAN: 'music-plan',
  PLAN: 'plan',
  STORYBOARD: 'storyboard',
  QUEUE: 'queue',
  SHOTS: 'shots',
  AUDIO: 'audio',
  TIMELINE: 'timeline',
} satisfies Record<string, ProductionStageId>;

export const PRODUCTION_STAGE_STATE = {
  UNKNOWN: 'unknown',
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  BLOCKED: 'blocked',
} satisfies Record<string, ProductionStageState>;

export const DEFAULT_PRODUCTION_STAGE_STATE: ProductionStageState =
  PRODUCTION_STAGE_STATE.UNKNOWN;

export const MUSIC_DRIVEN_NARRATIVE_MODE = 'MUSIC_DRIVEN';

export const SCREENPLAY_DRIVEN_NARRATIVE_MODES: ReadonlySet<string> = new Set([
  'SCREENPLAY',
]);

export const PRODUCTION_STAGE_STATE_TONE = {
  unknown: STATUS_TONE.CHECKING,
  pending: STATUS_TONE.NEUTRAL,
  in_review: STATUS_TONE.ATTENTION,
  approved: STATUS_TONE.SUCCESS,
  blocked: STATUS_TONE.WARNING,
} satisfies Record<ProductionStageState, StatusTone>;

export const PRODUCTION_STAGE_STATE_LABEL_KEY = {
  unknown: 'stage.unknown',
  pending: 'stage.pending',
  in_review: 'stage.in_review',
  approved: 'stage.approved',
  blocked: 'stage.blocked',
} satisfies Record<ProductionStageState, TranslationKey>;
