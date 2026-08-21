import { queryOptions } from '@tanstack/react-query';
import { sourceAssetSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectId, SourceAssetId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { ASSET_DETAIL_STALE_TIME_MS } from '@/lib/query/query.constants';

export const assetDetailQueryKey = (
  projectId: ProjectId,
  assetId: SourceAssetId,
): string[] => ['asset-detail', projectId, assetId];

export const assetDetailQueryOptions = (
  projectId: ProjectId,
  assetId: SourceAssetId,
) =>
  queryOptions({
    queryKey: assetDetailQueryKey(projectId, assetId),
    queryFn: ({ signal }) =>
      requestJson(
        API_PATH.projectAsset(projectId, assetId),
        sourceAssetSchema,
        { signal },
      ),
    staleTime: ASSET_DETAIL_STALE_TIME_MS,
  });
