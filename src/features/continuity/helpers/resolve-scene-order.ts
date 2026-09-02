import type { Scene, SceneId } from 'sky-filme-studio-be/contracts';

export const resolveSceneOrder = (
  scenes: readonly Scene[],
  sceneId: SceneId,
): number | undefined => scenes.find((scene) => scene.id === sceneId)?.order;
