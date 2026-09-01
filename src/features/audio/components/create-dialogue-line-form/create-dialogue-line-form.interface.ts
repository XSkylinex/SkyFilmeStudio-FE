import type { ProjectId, SceneId } from 'sky-filme-studio-be/contracts';

export interface CreateDialogueLineFormProps {
  projectId: ProjectId;
  sceneId: SceneId;
  nextOrder: number;
  onClose: () => void;
}
