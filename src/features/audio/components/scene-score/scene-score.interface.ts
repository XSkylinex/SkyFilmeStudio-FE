import type {
  ProductionId,
  ProjectId,
  SceneId,
} from 'sky-filme-studio-be/contracts';

export interface SceneScoreProps {
  readonly projectId: ProjectId;
  readonly productionId: ProductionId;
  readonly sceneId: SceneId;
}
