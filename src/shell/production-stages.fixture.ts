import { PRODUCTION_STAGE_ID } from './navigation.constants';
import type { ProductionStage } from './interfaces/production-stage';

type ProductionStageDefinition = Omit<ProductionStage, 'state'>;

export const SCREENPLAY_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.SCREENPLAY,
  label: 'Screenplay',
  path: 'plan',
};

export const MUSIC_PLAN_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.MUSIC_PLAN,
  label: 'Music plan',
  path: 'plan',
};

export const PLAN_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.PLAN,
  label: 'Plan',
  path: 'plan',
};

const STORYBOARD_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.STORYBOARD,
  label: 'Storyboard',
  path: 'storyboard',
};

const QUEUE_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.QUEUE,
  label: 'Render queue',
  path: 'queue',
};

const SHOTS_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.SHOTS,
  label: 'Shots',
  path: 'shots',
};

const AUDIO_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.AUDIO,
  label: 'Audio',
  path: 'audio',
};

const TIMELINE_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.TIMELINE,
  label: 'Timeline',
  path: 'timeline',
};

export const PRODUCTION_STAGE_SEQUENCE: readonly ProductionStageDefinition[] = [
  STORYBOARD_STAGE,
  QUEUE_STAGE,
  SHOTS_STAGE,
  AUDIO_STAGE,
  TIMELINE_STAGE,
];

export const PRODUCTION_NARRATIVE_MODE_FIXTURE = 'SCREENPLAY';
