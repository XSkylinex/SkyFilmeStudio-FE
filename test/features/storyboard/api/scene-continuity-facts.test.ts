import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  productionIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  sceneContinuityFactsQueryKey,
  sceneContinuityFactsQueryOptions,
} from '@/features/storyboard/api/scene-continuity-facts.query';
import { SCENE_CONTINUITY_FACTS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildContinuityFact } from '../../../fixtures/continuity-fact.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('sceneContinuityFactsQueryKey', () => {
  it('keys by production and scene, so two scenes never share a cached list', () => {
    const otherScene = sceneIdSchema.parse(
      '99999999-9999-4999-8999-999999999999',
    );

    expect(sceneContinuityFactsQueryKey(PRODUCTION_ID, SCENE_ID)).toEqual([
      'scene-continuity-facts',
      PRODUCTION_ID,
      SCENE_ID,
    ]);
    expect(sceneContinuityFactsQueryKey(PRODUCTION_ID, SCENE_ID)).not.toEqual(
      sceneContinuityFactsQueryKey(PRODUCTION_ID, otherScene),
    );
  });
});

describe('sceneContinuityFactsQueryOptions', () => {
  it('uses SCENE_CONTINUITY_FACTS_STALE_TIME_MS as its staleTime', () => {
    expect(
      sceneContinuityFactsQueryOptions(PRODUCTION_ID, SCENE_ID).staleTime,
    ).toBe(SCENE_CONTINUITY_FACTS_STALE_TIME_MS);
  });

  it('sends the scene as a query parameter and parses the bare array back', async () => {
    const facts = [buildContinuityFact()];
    let capturedUrl: URL | undefined;
    server.use(
      http.get(
        API_PATH.continuityFactsInForce(PRODUCTION_ID, SCENE_ID),
        ({ request }) => {
          capturedUrl = new URL(request.url);
          return HttpResponse.json(facts);
        },
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        sceneContinuityFactsQueryOptions(PRODUCTION_ID, SCENE_ID),
      ),
    ).resolves.toEqual(facts);

    expect(capturedUrl?.searchParams.get('scene')).toBe(SCENE_ID);
  });

  it('refuses a fact missing its required sourceEvent field', async () => {
    const fact = buildContinuityFact();
    server.use(
      http.get(API_PATH.continuityFactsInForce(PRODUCTION_ID, SCENE_ID), () =>
        HttpResponse.json([{ ...fact, sourceEvent: undefined }]),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        sceneContinuityFactsQueryOptions(PRODUCTION_ID, SCENE_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
