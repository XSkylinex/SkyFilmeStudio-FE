import { queryOptions } from '@tanstack/react-query';
import { pageSchema, productionSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PRODUCTIONS_STALE_TIME_MS } from '@/lib/query/query.constants';

const productionPageSchema = pageSchema(productionSchema);

export const productionsQueryKey = (projectId: ProjectId): string[] => [
  'productions',
  projectId,
];

export const productionsQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: productionsQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.productions(projectId), productionPageSchema, {
        signal,
      }),
    staleTime: PRODUCTIONS_STALE_TIME_MS,
  });
