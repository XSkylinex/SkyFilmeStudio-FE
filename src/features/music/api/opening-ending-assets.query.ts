import { queryOptions } from '@tanstack/react-query';
import {
  openingEndingAssetSchema,
  pageSchema,
} from 'sky-filme-studio-be/contracts';
import type { ProjectId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { OPENING_ENDING_ASSETS_STALE_TIME_MS } from '@/lib/query/query.constants';

const openingEndingAssetPageSchema = pageSchema(openingEndingAssetSchema);

export const openingEndingAssetsQueryKey = (projectId: ProjectId): string[] => [
  'opening-ending-assets',
  projectId,
];

export const openingEndingAssetsQueryOptions = (projectId: ProjectId) =>
  queryOptions({
    queryKey: openingEndingAssetsQueryKey(projectId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.openingEndingAssets(projectId),
        openingEndingAssetPageSchema,
        { signal },
      ),
    staleTime: OPENING_ENDING_ASSETS_STALE_TIME_MS,
  });
