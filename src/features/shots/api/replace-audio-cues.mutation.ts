import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { audioCueSchema } from 'sky-filme-studio-be/contracts';
import type {
  AudioCue,
  ReplaceAudioCuesRequest,
  ShotId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { shotAudioCuesQueryKey } from '@/features/shots/api/shot-audio-cues.query';

const audioCueListSchema = audioCueSchema.array();

const replaceAudioCues = (
  shotId: ShotId,
  request: ReplaceAudioCuesRequest,
): Promise<readonly AudioCue[]> =>
  requestJson(API_PATH.shotAudioCues(shotId), audioCueListSchema, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const replaceAudioCuesMutationOptions = (
  shotId: ShotId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: ReplaceAudioCuesRequest) =>
      replaceAudioCues(shotId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: shotAudioCuesQueryKey(shotId),
      });
    },
  });
