import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { DialogueLineId, SceneId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestNoContent } from '@/lib/api/request-no-content';
import { sceneDialogueLinesQueryKey } from '@/features/audio/api/scene-dialogue-lines.query';

const deleteDialogueLine = (dialogueLineId: DialogueLineId): Promise<void> =>
  requestNoContent(API_PATH.dialogueLine(dialogueLineId), {
    method: 'DELETE',
  });

export const deleteDialogueLineMutationOptions = (
  dialogueLineId: DialogueLineId,
  sceneId: SceneId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: () => deleteDialogueLine(dialogueLineId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sceneDialogueLinesQueryKey(sceneId),
      });
    },
  });
