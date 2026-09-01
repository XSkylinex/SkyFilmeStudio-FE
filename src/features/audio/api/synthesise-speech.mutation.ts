import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { synthesiseSpeechRequestSchema } from 'sky-filme-studio-be/contracts';
import type {
  DialogueLineId,
  SceneId,
  SynthesiseSpeechRequest,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { sceneDialogueLinesQueryKey } from '@/features/audio/api/scene-dialogue-lines.query';
import { dialogueLineQueryKey } from '@/features/audio/helpers/dialogue-line-query-key';

const submittedSchema = z.unknown();

const synthesiseSpeech = (
  dialogueLineId: DialogueLineId,
  request: SynthesiseSpeechRequest,
): Promise<unknown> =>
  requestJson(API_PATH.dialogueLineSpeech(dialogueLineId), submittedSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(synthesiseSpeechRequestSchema.parse(request)),
  });

export const synthesiseSpeechMutationOptions = (
  dialogueLineId: DialogueLineId,
  sceneId: SceneId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: SynthesiseSpeechRequest) =>
      synthesiseSpeech(dialogueLineId, request),
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
