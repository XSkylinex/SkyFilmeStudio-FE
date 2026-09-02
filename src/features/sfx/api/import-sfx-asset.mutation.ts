import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { sfxAssetSchema } from 'sky-filme-studio-be/contracts';
import type {
  ImportSfxAssetRequest,
  SfxAsset,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { sfxAssetsQueryKey } from '@/features/sfx/api/sfx-assets.query';

const importSfxAsset = (request: ImportSfxAssetRequest): Promise<SfxAsset> =>
  requestJson(API_PATH.sfxAssets(), sfxAssetSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const importSfxAssetMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: importSfxAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sfxAssetsQueryKey() });
    },
  });
