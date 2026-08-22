import { queryOptions } from '@tanstack/react-query';
import {
  pageSchema,
  productionProfileSchema,
} from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PRODUCTION_PROFILES_STALE_TIME_MS } from '@/lib/query/query.constants';

const productionProfilePageSchema = pageSchema(productionProfileSchema);

export const productionProfilesQueryKey = (projectId: ProjectId): string[] => [
  'production-profiles',
  projectId,
];

export const productionProfilesQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: productionProfilesQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.productionProfiles(projectId),
        productionProfilePageSchema,
        { signal },
      ),
    staleTime: PRODUCTION_PROFILES_STALE_TIME_MS,
  });
