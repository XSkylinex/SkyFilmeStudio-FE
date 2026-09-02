import type {
  ContinuityFact,
  ProductionId,
  Scene,
} from 'sky-filme-studio-be/contracts';

export interface ContinuityFactCardProps {
  readonly productionId: ProductionId;
  readonly fact: ContinuityFact;
  readonly scenes: readonly Scene[];
  readonly onFilterByEntity: (entityId: string) => void;
}
