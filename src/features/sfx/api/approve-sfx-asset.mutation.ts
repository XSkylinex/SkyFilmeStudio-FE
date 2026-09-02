import { mutationOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { sfxAssetSchema } from 'sky-filme-studio-be/contracts';
import type { SfxAsset, SfxAssetId } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { sfxAssetsQueryKey } from '@/features/sfx/api/sfx-assets.query';

const approveSfxAsset = (sfxAssetId: SfxAssetId): Promise<SfxAsset> =>
  requestJson(API_PATH.approveSfxAsset(sfxAssetId), sfxAssetSchema, {
    method: 'POST',
  });

export const approveSfxAssetMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: approveSfxAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sfxAssetsQueryKey() });
    },
  });
