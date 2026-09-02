import { queryOptions } from '@tanstack/react-query';
import { sceneCueSchema } from 'sky-filme-studio-be/contracts';
import type { SceneId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { SCENE_CUES_STALE_TIME_MS } from '@/lib/query/query.constants';

const sceneCueListSchema = sceneCueSchema.array();

export const sceneCuesQueryKey = (sceneId: SceneId): string[] => [
  'scene-cues',
  sceneId,
];

export const sceneCuesQueryOptions = (sceneId: SceneId) =>
  queryOptions({
    queryKey: sceneCuesQueryKey(sceneId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.sceneCues(sceneId), sceneCueListSchema, { signal }),
    staleTime: SCENE_CUES_STALE_TIME_MS,
  });
