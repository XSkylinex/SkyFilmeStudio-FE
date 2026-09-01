import { queryOptions } from '@tanstack/react-query';
import { shotSchema } from 'sky-filme-studio-be/contracts';
import type { SceneId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { SCENE_SHOTS_STALE_TIME_MS } from '@/lib/query/query.constants';

const sceneShotsSchema = shotSchema.array();

export const SCENE_SHOTS_QUERY_PREFIX: readonly string[] = ['scene-shots'];

export const sceneShotsQueryKey = (sceneId: SceneId): string[] => [
  ...SCENE_SHOTS_QUERY_PREFIX,
  sceneId,
];

export const sceneShotsQueryOptions = (sceneId: SceneId) =>
  queryOptions({
    queryKey: sceneShotsQueryKey(sceneId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.sceneShots(sceneId), sceneShotsSchema, {
        signal,
      }),
    staleTime: SCENE_SHOTS_STALE_TIME_MS,
  });
