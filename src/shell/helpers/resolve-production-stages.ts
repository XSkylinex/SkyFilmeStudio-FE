import {
  DEFAULT_PRODUCTION_STAGE_STATE,
  MUSIC_DRIVEN_NARRATIVE_MODE,
} from '../navigation.constants';
import {
  MUSIC_PLAN_STAGE,
  PRODUCTION_STAGE_SEQUENCE,
  SCREENPLAY_STAGE,
} from '../production-stages.fixture';
import type { ProductionStage } from '../interfaces/production-stage';
import type { ProductionStageStates } from '../interfaces/production-stage-states';

export const resolveProductionStages = (
  mode: string,
  stageStates: ProductionStageStates,
): ProductionStage[] => {
  const planStage =
    mode === MUSIC_DRIVEN_NARRATIVE_MODE ? MUSIC_PLAN_STAGE : SCREENPLAY_STAGE;
  const stages = [planStage, ...PRODUCTION_STAGE_SEQUENCE];

  return stages.map((stage) => ({
    ...stage,
    state: stageStates[stage.id] ?? DEFAULT_PRODUCTION_STAGE_STATE,
  }));
};
