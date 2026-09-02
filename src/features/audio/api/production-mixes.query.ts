import { queryOptions } from '@tanstack/react-query';
import { productionMixSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PRODUCTION_MIXES_STALE_TIME_MS } from '@/lib/query/query.constants';

const productionMixListSchema = productionMixSchema.array();

export const productionMixesQueryKey = (
  productionId: ProductionId,
): string[] => ['production-mixes', productionId];

export const productionMixesQueryOptions = (productionId: ProductionId) =>
  queryOptions({
    queryKey: productionMixesQueryKey(productionId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.productionMixes(productionId),
        productionMixListSchema,
        { signal },
      ),
    staleTime: PRODUCTION_MIXES_STALE_TIME_MS,
  });
