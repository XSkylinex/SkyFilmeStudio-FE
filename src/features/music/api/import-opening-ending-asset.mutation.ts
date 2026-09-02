import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { openingEndingAssetSchema } from 'sky-filme-studio-be/contracts';
import type {
  ImportOpeningEndingAssetRequest,
  OpeningEndingAsset,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { openingEndingAssetsQueryKey } from '@/features/music/api/opening-ending-assets.query';

const importAsset = (
  projectId: ProjectId,
  request: ImportOpeningEndingAssetRequest,
): Promise<OpeningEndingAsset> =>
  requestJson(
    API_PATH.openingEndingAssets(projectId),
    openingEndingAssetSchema,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
  );

export const importOpeningEndingAssetMutationOptions = (
  projectId: ProjectId,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (request: ImportOpeningEndingAssetRequest) =>
      importAsset(projectId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: openingEndingAssetsQueryKey(projectId),
      });
    },
  });
