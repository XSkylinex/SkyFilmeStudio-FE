import {
  DEFAULT_PRODUCTION_STAGE_STATE,
  MUSIC_DRIVEN_NARRATIVE_MODE,
  SCREENPLAY_DRIVEN_NARRATIVE_MODES,
} from '../navigation.constants';
import {
  MUSIC_PLAN_STAGE,
  PLAN_STAGE,
  PRODUCTION_STAGE_SEQUENCE,
  SCREENPLAY_STAGE,
} from '../production-stages.fixture';
import type { ProductionStage } from '../interfaces/production-stage';
import type { ProductionStageStates } from '../interfaces/production-stage-states';

const resolvePlanStage = (mode: string): typeof PLAN_STAGE => {
  if (mode === MUSIC_DRIVEN_NARRATIVE_MODE) {
    return MUSIC_PLAN_STAGE;
  }
  if (SCREENPLAY_DRIVEN_NARRATIVE_MODES.has(mode)) {
    return SCREENPLAY_STAGE;
  }
  return PLAN_STAGE;
};

export const resolveProductionStages = (
  mode: string,
  stageStates: ProductionStageStates,
): ProductionStage[] => {
  const stages = [resolvePlanStage(mode), ...PRODUCTION_STAGE_SEQUENCE];

  return stages.map((stage) => ({
    ...stage,
    state: stageStates[stage.id] ?? DEFAULT_PRODUCTION_STAGE_STATE,
  }));
};
