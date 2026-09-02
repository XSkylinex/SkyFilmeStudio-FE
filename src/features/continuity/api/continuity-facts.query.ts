import { queryOptions } from '@tanstack/react-query';
import { continuityFactSchema, pageSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import type { ContinuityFactFilter } from '@/lib/api/interfaces/continuity-fact-filter';
import { requestJson } from '@/lib/api/request-json';
import { CONTINUITY_FACTS_STALE_TIME_MS } from '@/lib/query/query.constants';

const continuityFactPageSchema = pageSchema(continuityFactSchema);

export const continuityFactsQueryPrefix = (
  productionId: ProductionId,
): string[] => ['continuity-facts', productionId];

export const continuityFactsQueryKey = (
  productionId: ProductionId,
  filter: ContinuityFactFilter = {},
): string[] => [
  ...continuityFactsQueryPrefix(productionId),
  filter.entityId ?? '',
  filter.property ?? '',
];

export const continuityFactsQueryOptions = (
  productionId: ProductionId,
  filter: ContinuityFactFilter = {},
) =>
  queryOptions({
    queryKey: continuityFactsQueryKey(productionId, filter),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.continuityFacts(productionId, filter),
        continuityFactPageSchema,
        { signal },
      ),
    staleTime: CONTINUITY_FACTS_STALE_TIME_MS,
  });
