import { PRODUCTION_STAGE_ID } from './navigation.constants';
import {
  AUDIO_SEGMENT,
  PLAN_SEGMENT,
  QUEUE_SEGMENT,
  SHOTS_SEGMENT,
  STORYBOARD_SEGMENT,
  TIMELINE_SEGMENT,
} from './routes/routes.constants';
import type { ProductionStage } from './interfaces/production-stage';

type ProductionStageDefinition = Omit<ProductionStage, 'state'>;

export const SCREENPLAY_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.SCREENPLAY,
  labelKey: 'productionStage.screenplay',
  path: PLAN_SEGMENT,
};

export const MUSIC_PLAN_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.MUSIC_PLAN,
  labelKey: 'productionStage.musicPlan',
  path: PLAN_SEGMENT,
};

export const PLAN_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.PLAN,
  labelKey: 'page.planner.title',
  path: PLAN_SEGMENT,
};

const STORYBOARD_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.STORYBOARD,
  labelKey: 'page.storyboard.title',
  path: STORYBOARD_SEGMENT,
};

const QUEUE_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.QUEUE,
  labelKey: 'page.renderQueue.title',
  path: QUEUE_SEGMENT,
};

const SHOTS_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.SHOTS,
  labelKey: 'page.shots.title',
  path: SHOTS_SEGMENT,
};

const AUDIO_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.AUDIO,
  labelKey: 'page.audio.title',
  path: AUDIO_SEGMENT,
};

const TIMELINE_STAGE: ProductionStageDefinition = {
  id: PRODUCTION_STAGE_ID.TIMELINE,
  labelKey: 'page.timeline.title',
  path: TIMELINE_SEGMENT,
};

export const PRODUCTION_STAGE_SEQUENCE: readonly ProductionStageDefinition[] = [
  STORYBOARD_STAGE,
  QUEUE_STAGE,
  SHOTS_STAGE,
  AUDIO_STAGE,
  TIMELINE_STAGE,
];

export const PRODUCTION_NARRATIVE_MODE_FIXTURE = 'SCREENPLAY';
