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

const deleteAsset = (
  projectId: ProjectId,
  assetId: OpeningEndingAssetId,
): Promise<OpeningEndingAsset> =>
  requestJson(
    API_PATH.openingEndingAsset(projectId, assetId),
    openingEndingAssetSchema,
    { method: 'DELETE' },
  );

export const deleteOpeningEndingAssetMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (assetId: OpeningEndingAssetId) =>
      deleteAsset(projectId, assetId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: openingEndingAssetsQueryKey(projectId),
      });
    },
  });
