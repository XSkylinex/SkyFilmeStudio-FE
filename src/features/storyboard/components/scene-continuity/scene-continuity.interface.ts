import type { ProductionId, SceneId } from 'sky-filme-studio-be/contracts';

export interface SceneContinuityProps {
  readonly productionId: ProductionId;
  readonly sceneId: SceneId;
}
