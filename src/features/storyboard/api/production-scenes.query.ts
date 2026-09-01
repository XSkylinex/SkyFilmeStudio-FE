import { queryOptions } from '@tanstack/react-query';
import { sceneSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PRODUCTION_SCENES_STALE_TIME_MS } from '@/lib/query/query.constants';

const productionScenesSchema = sceneSchema.array();

export const productionScenesQueryKey = (
  productionId: ProductionId,
): string[] => ['production-scenes', productionId];

export const productionScenesQueryOptions = (productionId: ProductionId) =>
  queryOptions({
    queryKey: productionScenesQueryKey(productionId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.planningScenes(productionId),
        productionScenesSchema,
        { signal },
      ),
    staleTime: PRODUCTION_SCENES_STALE_TIME_MS,
  });
