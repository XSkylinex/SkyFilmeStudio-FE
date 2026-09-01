import { queryOptions } from '@tanstack/react-query';
import { speechSynthesisSchema } from 'sky-filme-studio-be/contracts';
import type { DialogueLineId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { DIALOGUE_LINE_SPEECH_STALE_TIME_MS } from '@/lib/query/query.constants';
import { dialogueLineQueryKey } from '@/features/audio/helpers/dialogue-line-query-key';

const speechSynthesesSchema = speechSynthesisSchema.array();

export const dialogueLineSpeechQueryKey = (
  dialogueLineId: DialogueLineId,
): string[] => [...dialogueLineQueryKey(dialogueLineId), 'speech'];

export const dialogueLineSpeechQueryOptions = (
  dialogueLineId: DialogueLineId,
) =>
  queryOptions({
    queryKey: dialogueLineSpeechQueryKey(dialogueLineId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.dialogueLineSpeech(dialogueLineId),
        speechSynthesesSchema,
        { signal },
      ),
    staleTime: DIALOGUE_LINE_SPEECH_STALE_TIME_MS,
  });
