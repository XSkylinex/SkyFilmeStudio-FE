import { queryOptions } from '@tanstack/react-query';
import type { ProductionId, SceneId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestText } from '@/lib/api/request-text';
import { PLANNING_CONTEXT_STALE_TIME_MS } from '@/lib/query/query.constants';

export const planningContextQueryPrefix = (
  productionId: ProductionId,
): string[] => ['planning-context', productionId];

export const planningContextQueryKey = (
  productionId: ProductionId,
  sceneId: SceneId,
): string[] => [...planningContextQueryPrefix(productionId), sceneId];

export const planningContextQueryOptions = (
  productionId: ProductionId,
  sceneId: SceneId,
) =>
  queryOptions({
    queryKey: planningContextQueryKey(productionId, sceneId),
    queryFn: ({ signal }) =>
      requestText(API_PATH.planningContext(productionId, sceneId), { signal }),
    staleTime: PLANNING_CONTEXT_STALE_TIME_MS,
  });
