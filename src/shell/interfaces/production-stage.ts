import type { ProductionStageId } from './production-stage-id';
import type { ProductionStageState } from './production-stage-state';

export interface ProductionStage {
  readonly id: ProductionStageId;
  readonly label: string;
  readonly path: string;
  readonly state: ProductionStageState;
}
