import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { sceneIdSchema, shotIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  sceneShotsQueryKey,
  sceneShotsQueryOptions,
} from '@/features/storyboard/api/scene-shots.query';
import { SCENE_SHOTS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildShot } from '../../../fixtures/shot.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const OTHER_SHOT_ID = shotIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('sceneShotsQueryKey', () => {
  it('keys by scene, so two scenes never share a cached list', () => {
    const other = sceneIdSchema.parse('99999999-9999-4999-8999-999999999999');

    expect(sceneShotsQueryKey(SCENE_ID)).toEqual(['scene-shots', SCENE_ID]);
    expect(sceneShotsQueryKey(SCENE_ID)).not.toEqual(sceneShotsQueryKey(other));
  });
});

describe('sceneShotsQueryOptions', () => {
  it('uses SCENE_SHOTS_STALE_TIME_MS as its staleTime', () => {
    expect(sceneShotsQueryOptions(SCENE_ID).staleTime).toBe(
      SCENE_SHOTS_STALE_TIME_MS,
    );
  });

  it('parses the bare array the orchestrator sends, with no page envelope', async () => {
    const shots = [
      buildShot({ order: 0 }),
      buildShot({
        id: OTHER_SHOT_ID,
        order: 1,
      }),
    ];
    server.use(
      http.get(API_PATH.sceneShots(SCENE_ID), () => HttpResponse.json(shots)),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(sceneShotsQueryOptions(SCENE_ID)),
    ).resolves.toEqual(shots);
  });

  it('refuses a shot state the contract does not define', async () => {
    const shot = buildShot();
    server.use(
      http.get(API_PATH.sceneShots(SCENE_ID), () =>
        HttpResponse.json([{ ...shot, state: 'NOT_A_REAL_STATE' }]),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(sceneShotsQueryOptions(SCENE_ID)),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
