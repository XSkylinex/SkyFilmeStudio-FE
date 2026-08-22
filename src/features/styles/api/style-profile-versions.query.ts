import { queryOptions } from '@tanstack/react-query';
import { styleProfileSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId, StyleProfileId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { STYLE_PROFILE_VERSIONS_STALE_TIME_MS } from '@/lib/query/query.constants';

const styleProfileListSchema = styleProfileSchema.array();

export const styleProfileVersionsQueryKey = (
  projectId: ProjectId,
  lineageId: StyleProfileId,
): string[] => ['style-profile-versions', projectId, lineageId];

export const styleProfileVersionsQueryOptions = (
  projectId: ProjectId,
  lineageId: StyleProfileId,
) =>
  queryOptions({
    queryKey: styleProfileVersionsQueryKey(projectId, lineageId),
    queryFn: ({ signal }) =>
      requestJson(
        `${API_PATH.styleProfileVersions(projectId)}?lineageId=${lineageId}`,
        styleProfileListSchema,
        { signal },
      ),
    staleTime: STYLE_PROFILE_VERSIONS_STALE_TIME_MS,
  });
