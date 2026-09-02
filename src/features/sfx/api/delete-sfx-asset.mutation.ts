import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { sfxAssetSchema } from 'sky-filme-studio-be/contracts';
import type { SfxAsset, SfxAssetId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { sfxAssetsQueryKey } from '@/features/sfx/api/sfx-assets.query';

const deleteSfxAsset = (sfxAssetId: SfxAssetId): Promise<SfxAsset> =>
  requestJson(API_PATH.sfxAsset(sfxAssetId), sfxAssetSchema, {
    method: 'DELETE',
  });

export const deleteSfxAssetMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: deleteSfxAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sfxAssetsQueryKey() });
    },
  });
