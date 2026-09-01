import type { ProductionId, Scene } from 'sky-filme-studio-be/contracts';

export interface ScenePanelProps {
  readonly productionId: ProductionId;
  readonly scene: Scene;
}
