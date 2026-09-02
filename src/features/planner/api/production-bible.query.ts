import { queryOptions } from '@tanstack/react-query';
import { projectBibleSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PRODUCTION_BIBLE_STALE_TIME_MS } from '@/lib/query/query.constants';

export const productionBibleQueryKey = (
  productionId: ProductionId,
): string[] => ['production-bible', productionId];

export const productionBibleQueryOptions = (productionId: ProductionId) =>
  queryOptions({
    queryKey: productionBibleQueryKey(productionId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.productionBible(productionId), projectBibleSchema, {
        signal,
      }),
    staleTime: PRODUCTION_BIBLE_STALE_TIME_MS,
  });
