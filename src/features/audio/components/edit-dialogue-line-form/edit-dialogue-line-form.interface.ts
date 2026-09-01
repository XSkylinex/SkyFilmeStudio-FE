import type { DialogueLine, SceneId } from 'sky-filme-studio-be/contracts';

export interface EditDialogueLineFormProps {
  line: DialogueLine;
  sceneId: SceneId;
  onClose: () => void;
}
