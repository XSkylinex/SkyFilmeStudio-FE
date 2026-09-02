import type { ProductionStageStates } from '@/shell/interfaces/production-stage-states';

export interface ProductionNavProps {
  mode: string;
  stageStates: ProductionStageStates;
  continuityPath: string | undefined;
}
