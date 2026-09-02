import type { ProductionId, Scene } from 'sky-filme-studio-be/contracts';

export interface CreateContinuityFactFormProps {
  readonly productionId: ProductionId;
  readonly scenes: readonly Scene[];
  readonly onClose: () => void;
}
