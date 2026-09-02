import { queryOptions } from '@tanstack/react-query';
import { continuityFactSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionId, SceneId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { SCENE_CONTINUITY_FACTS_STALE_TIME_MS } from '@/lib/query/query.constants';

const sceneContinuityFactsSchema = continuityFactSchema.array();

export const sceneContinuityFactsQueryPrefix = (
  productionId: ProductionId,
): string[] => ['scene-continuity-facts', productionId];

export const sceneContinuityFactsQueryKey = (
  productionId: ProductionId,
  sceneId: SceneId,
): string[] => [...sceneContinuityFactsQueryPrefix(productionId), sceneId];

export const sceneContinuityFactsQueryOptions = (
  productionId: ProductionId,
  sceneId: SceneId,
) =>
  queryOptions({
    queryKey: sceneContinuityFactsQueryKey(productionId, sceneId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.continuityFactsInForce(productionId, sceneId),
        sceneContinuityFactsSchema,
        { signal },
      ),
    staleTime: SCENE_CONTINUITY_FACTS_STALE_TIME_MS,
  });
