import type { ContinuityFact, Scene } from 'sky-filme-studio-be/contracts';

export interface ContinuityFactCardProps {
  readonly fact: ContinuityFact;
  readonly scenes: readonly Scene[];
  readonly onFilterByEntity: (entityId: string) => void;
}
