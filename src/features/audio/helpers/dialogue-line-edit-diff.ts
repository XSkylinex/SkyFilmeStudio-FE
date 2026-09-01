import type {
  DialogueLine,
  UpdateDialogueLineRequest,
} from 'sky-filme-studio-be/contracts';
import type { DialogueLineEditValues } from '@/features/audio/interfaces/dialogue-line-edit-values';

export const dialogueLineEditDiff = (
  original: DialogueLine,
  edited: DialogueLineEditValues,
): UpdateDialogueLineRequest => {
  const patch: UpdateDialogueLineRequest = {};

  if (edited.text !== original.text) {
    patch.text = edited.text;
  }
  if (edited.emotion !== original.emotion) {
    patch.emotion = edited.emotion;
  }
  if (edited.pace !== original.pace) {
    patch.pace = edited.pace;
  }
  if (edited.pauseBeforeMs !== original.pauseBeforeMs) {
    patch.pauseBeforeMs = edited.pauseBeforeMs;
  }
  if (edited.pauseAfterMs !== original.pauseAfterMs) {
    patch.pauseAfterMs = edited.pauseAfterMs;
  }

  return patch;
};
