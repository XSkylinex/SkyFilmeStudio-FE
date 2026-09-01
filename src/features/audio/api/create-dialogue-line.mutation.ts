import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { dialogueLineSchema } from 'sky-filme-studio-be/contracts';
import type {
  CreateDialogueLineRequest,
  DialogueLine,
  SceneId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { sceneDialogueLinesQueryKey } from '@/features/audio/api/scene-dialogue-lines.query';

const createDialogueLine = (
  sceneId: SceneId,
  request: CreateDialogueLineRequest,
): Promise<DialogueLine> =>
  requestJson(API_PATH.sceneDialogueLines(sceneId), dialogueLineSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const createDialogueLineMutationOptions = (
  sceneId: SceneId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: CreateDialogueLineRequest) =>
      createDialogueLine(sceneId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sceneDialogueLinesQueryKey(sceneId),
      });
    },
  });
