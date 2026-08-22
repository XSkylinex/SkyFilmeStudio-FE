import { queryOptions } from '@tanstack/react-query';
import { styleProfileSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId, StyleProfileId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { STYLE_PROFILES_STALE_TIME_MS } from '@/lib/query/query.constants';

export const styleProfileQueryKey = (
  projectId: ProjectId,
  styleProfileId: StyleProfileId,
): string[] => ['style-profile', projectId, styleProfileId];

export const styleProfileQueryOptions = (
  projectId: ProjectId,
  styleProfileId: StyleProfileId,
) =>
  queryOptions({
    queryKey: styleProfileQueryKey(projectId, styleProfileId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.styleProfile(projectId, styleProfileId),
        styleProfileSchema,
        { signal },
      ),
    staleTime: STYLE_PROFILES_STALE_TIME_MS,
  });
