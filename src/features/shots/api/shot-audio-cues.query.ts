import { queryOptions } from '@tanstack/react-query';
import { audioCueSchema } from 'sky-filme-studio-be/contracts';
import type { ShotId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { SHOT_AUDIO_CUES_STALE_TIME_MS } from '@/lib/query/query.constants';

const audioCueListSchema = audioCueSchema.array();

export const shotAudioCuesQueryKey = (shotId: ShotId): string[] => [
  'shot-audio-cues',
  shotId,
];

export const shotAudioCuesQueryOptions = (shotId: ShotId) =>
  queryOptions({
    queryKey: shotAudioCuesQueryKey(shotId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.shotAudioCues(shotId), audioCueListSchema, {
        signal,
      }),
    staleTime: SHOT_AUDIO_CUES_STALE_TIME_MS,
  });
