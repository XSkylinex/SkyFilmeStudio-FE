import type { ProductionStageId } from './production-stage-id';
import type { ProductionStageState } from './production-stage-state';

export type ProductionStageStates = Partial<
  Record<ProductionStageId, ProductionStageState>
>;
