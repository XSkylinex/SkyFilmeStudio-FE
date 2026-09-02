import { queryOptions } from '@tanstack/react-query';
import { sceneMixSchema } from 'sky-filme-studio-be/contracts';
import type { SceneId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { SCENE_MIXES_STALE_TIME_MS } from '@/lib/query/query.constants';

const sceneMixListSchema = sceneMixSchema.array();

export const sceneMixesQueryKey = (sceneId: SceneId): string[] => [
  'scene-mixes',
  sceneId,
];

export const sceneMixesQueryOptions = (sceneId: SceneId) =>
  queryOptions({
    queryKey: sceneMixesQueryKey(sceneId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.sceneMixes(sceneId), sceneMixListSchema, { signal }),
    staleTime: SCENE_MIXES_STALE_TIME_MS,
  });
