import { queryOptions } from '@tanstack/react-query';
import { pageSchema, sfxAssetSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestJson } from '@/lib/api/request-json';
import { SFX_ASSETS_STALE_TIME_MS } from '@/lib/query/query.constants';

const sfxAssetPageSchema = pageSchema(sfxAssetSchema);

export const sfxAssetsQueryKey = (): string[] => ['sfx-assets'];

export const sfxAssetsQueryOptions = () =>
  queryOptions({
    queryKey: sfxAssetsQueryKey(),
    queryFn: ({ signal }) =>
      requestJson(API_PATH.sfxAssets(), sfxAssetPageSchema, { signal }),
    staleTime: SFX_ASSETS_STALE_TIME_MS,
  });
