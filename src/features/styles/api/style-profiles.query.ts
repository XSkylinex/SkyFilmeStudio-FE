import { queryOptions } from '@tanstack/react-query';
import { pageSchema, styleProfileSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { STYLE_PROFILES_STALE_TIME_MS } from '@/lib/query/query.constants';

const styleProfilePageSchema = pageSchema(styleProfileSchema);

export const styleProfilesQueryKey = (projectId: ProjectId): string[] => [
  'style-profiles',
  projectId,
];

export const styleProfilesQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: styleProfilesQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.styleProfiles(projectId), styleProfilePageSchema, {
        signal,
      }),
    staleTime: STYLE_PROFILES_STALE_TIME_MS,
  });
