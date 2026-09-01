import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { dialogueLineSchema } from 'sky-filme-studio-be/contracts';
import type {
  DialogueLine,
  DialogueLineId,
  SceneId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { sceneDialogueLinesQueryKey } from '@/features/audio/api/scene-dialogue-lines.query';
import { dialogueLineQueryKey } from '@/features/audio/helpers/dialogue-line-query-key';

const unapproveDialogueAudio = (
  dialogueLineId: DialogueLineId,
): Promise<DialogueLine> =>
  requestJson(
    API_PATH.dialogueLineSpeechApproval(dialogueLineId),
    dialogueLineSchema,
    { method: 'DELETE' },
  );

export const unapproveDialogueAudioMutationOptions = (
  dialogueLineId: DialogueLineId,
  sceneId: SceneId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: () => unapproveDialogueAudio(dialogueLineId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dialogueLineQueryKey(dialogueLineId),
        }),
        queryClient.invalidateQueries({
          queryKey: sceneDialogueLinesQueryKey(sceneId),
        }),
      ]);
    },
  });
