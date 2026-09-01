import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  productionIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { dialogueTimingMutationOptions } from '@/features/audio/api/dialogue-timing.mutation';
import { sceneShotsQueryOptions } from '@/features/storyboard/api/scene-shots.query';
import { planningBudgetQueryOptions } from '@/features/planner/api/planning-budget.query';
import { buildRuntimeBudgetReport } from '../../../fixtures/runtime-budget.fixture';
import { buildShot } from '../../../fixtures/shot.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '22222222-2222-4222-8222-222222222222',
);

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const budget = buildRuntimeBudgetReport({
  segments: [{ label: 'Scene 1', targetDurationSeconds: 1_200 }],
});

const report = {
  scenes: [
    {
      sceneId: SCENE_ID,
      order: 0,
      status: 'RETIMED',
      detail: 'Every shot in this scene was timed from a generated WAV.',
      measuredSeconds: 11,
      lockedShotCount: 0,
      shots: [],
    },
  ],
  measuredSceneCount: 1,
  estimatedSceneCount: 0,
  budget,
};

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      dialogueTimingMutationOptions(PRODUCTION_ID, queryClient),
    );

describe('dialogueTimingMutationOptions', () => {
  it('separates a measured scene from an estimated one, which the report insists on', async () => {
    server.use(
      http.post(API_PATH.productionDialogueTiming(PRODUCTION_ID), () =>
        HttpResponse.json({
          ...report,
          scenes: [
            report.scenes[0],
            {
              sceneId: '55555555-5555-4555-8555-555555555555',
              order: 1,
              status: 'ESTIMATED',
              detail: 'No shot in this scene carries dialogue.',
              lockedShotCount: 0,
              shots: [],
            },
          ],
          measuredSceneCount: 1,
          estimatedSceneCount: 1,
        }),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const result = await buildMutation(queryClient).execute(undefined);

    expect(result.measuredSceneCount).toBe(1);
    expect(result.estimatedSceneCount).toBe(1);
    expect(result.scenes[1]?.measuredSeconds).toBeUndefined();
  });

  it('refreshes the shots it just retimed, because the run rewrites their durations', async () => {
    let shotCalls = 0;
    server.use(
      http.get(API_PATH.sceneShots(SCENE_ID), () => {
        shotCalls += 1;
        return HttpResponse.json([
          buildShot({ targetDurationSeconds: shotCalls === 1 ? 6 : 11 }),
        ]);
      }),
      http.post(API_PATH.productionDialogueTiming(PRODUCTION_ID), () =>
        HttpResponse.json(report),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const before = await queryClient.fetchQuery(
      sceneShotsQueryOptions(SCENE_ID),
    );
    expect(before[0]?.targetDurationSeconds).toBe(6);

    await buildMutation(queryClient).execute(undefined);

    const after = await queryClient.fetchQuery(
      sceneShotsQueryOptions(SCENE_ID),
    );

    expect(shotCalls).toBe(2);
    expect(after[0]?.targetDurationSeconds).toBe(11);
  });

  it('refreshes the planner budget, which is computed from those same durations', async () => {
    let budgetCalls = 0;
    server.use(
      http.get(API_PATH.planningBudget(PRODUCTION_ID), () => {
        budgetCalls += 1;
        return HttpResponse.json(budget);
      }),
      http.post(API_PATH.productionDialogueTiming(PRODUCTION_ID), () =>
        HttpResponse.json(report),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await queryClient.fetchQuery(planningBudgetQueryOptions(PRODUCTION_ID));
    await buildMutation(queryClient).execute(undefined);
    await queryClient.fetchQuery(planningBudgetQueryOptions(PRODUCTION_ID));

    expect(budgetCalls).toBe(2);
  });
});
