import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { ProductionStageId } from './production-stage-id';
import type { ProductionStageState } from './production-stage-state';

export interface ProductionStage {
  readonly id: ProductionStageId;
  readonly labelKey: TranslationKey;
  readonly path: string;
  readonly state: ProductionStageState;
}
