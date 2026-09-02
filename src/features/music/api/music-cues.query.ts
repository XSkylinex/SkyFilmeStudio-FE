import { queryOptions } from '@tanstack/react-query';
import { musicCueSchema, pageSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { MUSIC_CUES_STALE_TIME_MS } from '@/lib/query/query.constants';

const musicCuePageSchema = pageSchema(musicCueSchema);

export const musicCuesQueryKey = (projectId: ProjectId): string[] => [
  'music-cues',
  projectId,
];

export const musicCuesQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: musicCuesQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.musicCues(projectId), musicCuePageSchema, {
        signal,
      }),
    staleTime: MUSIC_CUES_STALE_TIME_MS,
  });
