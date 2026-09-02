import { queryOptions } from '@tanstack/react-query';
import { sceneCueSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PRODUCTION_SCORE_STALE_TIME_MS } from '@/lib/query/query.constants';

const sceneCueListSchema = sceneCueSchema.array();

export const productionScoreQueryKey = (
  productionId: ProductionId,
): string[] => ['production-score', productionId];

export const productionScoreQueryOptions = (productionId: ProductionId) =>
  queryOptions({
    queryKey: productionScoreQueryKey(productionId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.productionScore(productionId), sceneCueListSchema, {
        signal,
      }),
    staleTime: PRODUCTION_SCORE_STALE_TIME_MS,
  });
