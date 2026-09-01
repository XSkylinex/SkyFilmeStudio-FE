import type { DialogueLineId } from 'sky-filme-studio-be/contracts';

export const dialogueLineQueryKey = (
  dialogueLineId: DialogueLineId,
): string[] => ['dialogue-line', dialogueLineId];
