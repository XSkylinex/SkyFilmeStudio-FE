import type { ProductionId, SceneId } from 'sky-filme-studio-be/contracts';

export interface PlanningContextDocumentProps {
  readonly productionId: ProductionId;
  readonly sceneId: SceneId;
}
