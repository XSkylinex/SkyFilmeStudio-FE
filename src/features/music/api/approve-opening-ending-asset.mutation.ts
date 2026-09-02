import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { openingEndingAssetSchema } from 'sky-filme-studio-be/contracts';
import type {
  OpeningEndingAsset,
  OpeningEndingAssetId,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { openingEndingAssetsQueryKey } from '@/features/music/api/opening-ending-assets.query';

const approveAsset = (
  projectId: ProjectId,
  assetId: OpeningEndingAssetId,
): Promise<OpeningEndingAsset> =>
  requestJson(
    API_PATH.approveOpeningEndingAsset(projectId, assetId),
    openingEndingAssetSchema,
    { method: 'POST' },
  );

export const approveOpeningEndingAssetMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (assetId: OpeningEndingAssetId) =>
      approveAsset(projectId, assetId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: openingEndingAssetsQueryKey(projectId),
      });
    },
  });
