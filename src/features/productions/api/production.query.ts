import { queryOptions } from '@tanstack/react-query';
import { productionSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionId, ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PRODUCTION_DETAIL_STALE_TIME_MS } from '@/lib/query/query.constants';

export const productionQueryKey = (
  projectId: ProjectId,
  productionId: ProductionId,
): string[] => ['production', projectId, productionId];

export const productionQueryOptions = (
  projectId: ProjectId,
  productionId: ProductionId,
) =>
  queryOptions({
    queryKey: productionQueryKey(projectId, productionId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.production(projectId, productionId),
        productionSchema,
        { signal },
      ),
    staleTime: PRODUCTION_DETAIL_STALE_TIME_MS,
  });
