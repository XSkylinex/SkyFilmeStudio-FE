import type { SceneId, ShotId } from 'sky-filme-studio-be/contracts';

export interface ShotFramesProps {
  readonly shotId: ShotId;
  readonly sceneId: SceneId;
  readonly shotOrder: number;
}
