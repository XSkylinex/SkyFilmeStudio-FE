import { queryOptions } from '@tanstack/react-query';
import { locationSchema, pageSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PROJECT_LOCATIONS_STALE_TIME_MS } from '@/lib/query/query.constants';

const locationPageSchema = pageSchema(locationSchema);

export const projectLocationsQueryKey = (projectId: ProjectId): string[] => [
  'project-locations',
  projectId,
];

export const projectLocationsQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: projectLocationsQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.locations(projectId), locationPageSchema, {
        signal,
      }),
    staleTime: PROJECT_LOCATIONS_STALE_TIME_MS,
  });
