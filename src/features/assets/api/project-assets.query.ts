import { queryOptions } from '@tanstack/react-query';
import { pageSchema, sourceAssetSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { PROJECT_ASSETS_STALE_TIME_MS } from '@/lib/query/query.constants';

const sourceAssetPageSchema = pageSchema(sourceAssetSchema);

export const projectAssetsQueryKey = (projectId: ProjectId): string[] => [
  'project-assets',
  projectId,
];

export const projectAssetsQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: projectAssetsQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.projectAssets(projectId), sourceAssetPageSchema, {
        signal,
      }),
    staleTime: PROJECT_ASSETS_STALE_TIME_MS,
  });
