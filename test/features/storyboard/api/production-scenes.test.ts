import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  productionIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  productionScenesQueryKey,
  productionScenesQueryOptions,
} from '@/features/storyboard/api/production-scenes.query';
import { PRODUCTION_SCENES_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildScene } from '../../../fixtures/scene.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const OTHER_SCENE_ID = sceneIdSchema.parse(
  '55555555-5555-4555-8555-555555555555',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('productionScenesQueryKey', () => {
  it('keys by production, so two productions never share a cached list', () => {
    const other = productionIdSchema.parse(
      '99999999-9999-4999-8999-999999999999',
    );

    expect(productionScenesQueryKey(PRODUCTION_ID)).toEqual([
      'production-scenes',
      PRODUCTION_ID,
    ]);
    expect(productionScenesQueryKey(PRODUCTION_ID)).not.toEqual(
      productionScenesQueryKey(other),
    );
  });
});

describe('productionScenesQueryOptions', () => {
  it('uses PRODUCTION_SCENES_STALE_TIME_MS as its staleTime', () => {
    expect(productionScenesQueryOptions(PRODUCTION_ID).staleTime).toBe(
      PRODUCTION_SCENES_STALE_TIME_MS,
    );
  });

  it('parses the bare array the orchestrator sends, with no page envelope', async () => {
    const scenes = [
      buildScene({ order: 0 }),
      buildScene({
        id: OTHER_SCENE_ID,
        order: 1,
      }),
    ];
    server.use(
      http.get(API_PATH.planningScenes(PRODUCTION_ID), () =>
        HttpResponse.json(scenes),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        productionScenesQueryOptions(PRODUCTION_ID),
      ),
    ).resolves.toEqual(scenes);
  });

  it('refuses a scene missing its required purpose field', async () => {
    const scene = buildScene();
    server.use(
      http.get(API_PATH.planningScenes(PRODUCTION_ID), () =>
        HttpResponse.json([{ ...scene, purpose: undefined }]),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        productionScenesQueryOptions(PRODUCTION_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
