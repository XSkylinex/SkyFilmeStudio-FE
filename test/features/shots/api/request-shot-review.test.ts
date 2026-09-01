import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { sceneIdSchema, shotIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { requestShotReviewMutationOptions } from '@/features/shots/api/request-shot-review.mutation';
import { shotQcRunsQueryOptions } from '@/features/shots/api/shot-qc-runs.query';
import { shotQcQueryKey } from '@/features/shots/helpers/shot-qc-query-key';
import {
  sceneShotsQueryKey,
  sceneShotsQueryOptions,
} from '@/features/storyboard/api/scene-shots.query';
import { buildQcRun } from '../../../fixtures/qc-run.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const SHOT_ID = shotIdSchema.parse('55555555-5555-4555-8555-555555555555');

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      requestShotReviewMutationOptions(SHOT_ID, SCENE_ID, queryClient),
    );

describe('requestShotReviewMutationOptions', () => {
  it('sends the hand-over with no body, because the route is a named transition', async () => {
    let captured: Request | undefined;
    server.use(
      http.post(API_PATH.shotQcRequestReview(SHOT_ID), ({ request }) => {
        captured = request;
        return HttpResponse.json({ runs: 2 });
      }),
    );

    await buildMutation(buildQueryClient()).execute(undefined);

    expect(captured?.method).toBe('POST');
    expect(captured?.headers.get('content-type')).toBeNull();
    await expect(captured?.text()).resolves.toBe('');
  });

  it('shows nothing the server has not confirmed while the hand-over is in flight', async () => {
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(
      http.get(API_PATH.shotQcRuns(SHOT_ID), () =>
        HttpResponse.json([buildQcRun()]),
      ),
      http.get(API_PATH.sceneShots(SCENE_ID), () => HttpResponse.json([])),
      http.post(API_PATH.shotQcRequestReview(SHOT_ID), async () => {
        await gate;
        return HttpResponse.json({ runs: 1 });
      }),
    );

    const queryClient = buildQueryClient();
    await queryClient.fetchQuery(shotQcRunsQueryOptions(SHOT_ID));
    await queryClient.fetchQuery(sceneShotsQueryOptions(SCENE_ID));

    const readCache = (): string =>
      JSON.stringify([
        queryClient.getQueriesData({ queryKey: shotQcQueryKey(SHOT_ID) }),
        queryClient.getQueriesData({ queryKey: sceneShotsQueryKey(SCENE_ID) }),
      ]);

    const before = readCache();
    const pending = buildMutation(queryClient).execute(undefined);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(readCache()).toBe(before);

    release?.();
    await pending;
  });

  it("re-reads the scene's shots, because the hand-over is a state transition on the shot", async () => {
    let shotCalls = 0;
    server.use(
      http.get(API_PATH.sceneShots(SCENE_ID), () => {
        shotCalls += 1;
        return HttpResponse.json([]);
      }),
      http.post(API_PATH.shotQcRequestReview(SHOT_ID), () =>
        HttpResponse.json({ runs: 1 }),
      ),
    );

    const queryClient = buildQueryClient();
    await queryClient.fetchQuery(sceneShotsQueryOptions(SCENE_ID));
    await buildMutation(queryClient).execute(undefined);
    await queryClient.fetchQuery(sceneShotsQueryOptions(SCENE_ID));

    expect(shotCalls).toBe(2);
  });

  it('surfaces the no-run refusal as the typed code the orchestrator raises', async () => {
    server.use(
      http.post(API_PATH.shotQcRequestReview(SHOT_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'SHOT_TRANSITION_INVALID',
            message: 'Shot has no QC run recorded.',
          },
          { status: 409 },
        ),
      ),
    );

    await expect(
      buildMutation(buildQueryClient()).execute(undefined),
    ).rejects.toMatchObject({ kind: 'HTTP', code: 'SHOT_TRANSITION_INVALID' });
  });
});
