import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  projectIdSchema,
  sourceAssetIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  assetDetailQueryKey,
  assetDetailQueryOptions,
} from '@/features/assets/api/asset-detail.query';
import { ASSET_DETAIL_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildSourceAsset } from '../../../fixtures/source-asset.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const ASSET_ID = sourceAssetIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

describe('assetDetailQueryKey', () => {
  it('keys by project and asset, so two assets never share a cached entry', () => {
    const otherAsset = sourceAssetIdSchema.parse(
      '22222222-2222-4222-8222-222222222222',
    );

    expect(assetDetailQueryKey(PROJECT_ID, ASSET_ID)).toEqual([
      'asset-detail',
      PROJECT_ID,
      ASSET_ID,
    ]);
    expect(assetDetailQueryKey(PROJECT_ID, ASSET_ID)).not.toEqual(
      assetDetailQueryKey(PROJECT_ID, otherAsset),
    );
  });
});

describe('assetDetailQueryOptions', () => {
  it('never treats an ingested original as stale', () => {
    expect(assetDetailQueryOptions(PROJECT_ID, ASSET_ID).staleTime).toBe(
      ASSET_DETAIL_STALE_TIME_MS,
    );
  });

  it('fetches from the single-asset path and returns the parsed asset', async () => {
    const asset = buildSourceAsset({ id: ASSET_ID, projectId: PROJECT_ID });
    server.use(
      http.get(API_PATH.projectAsset(PROJECT_ID, ASSET_ID), () =>
        HttpResponse.json(asset),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(assetDetailQueryOptions(PROJECT_ID, ASSET_ID)),
    ).resolves.toEqual(asset);
  });

  it('refuses an asset carrying a machine-absolute path', async () => {
    server.use(
      http.get(API_PATH.projectAsset(PROJECT_ID, ASSET_ID), () =>
        HttpResponse.json({
          ...buildSourceAsset({ id: ASSET_ID, projectId: PROJECT_ID }),
          path: '/Users/someone/IMG.jpg',
        }),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(assetDetailQueryOptions(PROJECT_ID, ASSET_ID)),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
