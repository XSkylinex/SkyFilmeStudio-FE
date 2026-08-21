import { queryOptions } from '@tanstack/react-query';
import type { ProjectId, SourceAssetId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestExists } from '@/lib/api/request-exists';
import { ASSET_PROXY_AVAILABILITY_STALE_TIME_MS } from '@/lib/query/query.constants';

export const assetProxyAvailabilityQueryKey = (
  projectId: ProjectId,
  assetId: SourceAssetId,
): string[] => ['asset-proxy-availability', projectId, assetId];

export const assetProxyAvailabilityQueryOptions = (
  projectId: ProjectId,
  assetId: SourceAssetId,
) =>
  queryOptions({
    queryKey: assetProxyAvailabilityQueryKey(projectId, assetId),
    queryFn: ({ signal }) =>
      requestExists(API_PATH.projectAssetProxy(projectId, assetId), { signal }),
    staleTime: ASSET_PROXY_AVAILABILITY_STALE_TIME_MS,
  });
