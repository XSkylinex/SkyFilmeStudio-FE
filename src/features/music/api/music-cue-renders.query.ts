import { queryOptions } from '@tanstack/react-query';
import {
  musicCueRenderSchema,
  pageSchema,
} from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { MUSIC_CUE_RENDERS_STALE_TIME_MS } from '@/lib/query/query.constants';

const musicCueRenderPageSchema = pageSchema(musicCueRenderSchema);

export const musicCueRendersQueryKey = (projectId: ProjectId): string[] => [
  'music-cue-renders',
  projectId,
];

export const musicCueRendersQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: musicCueRendersQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.musicCueRenders(projectId),
        musicCueRenderPageSchema,
        { signal },
      ),
    staleTime: MUSIC_CUE_RENDERS_STALE_TIME_MS,
  });
