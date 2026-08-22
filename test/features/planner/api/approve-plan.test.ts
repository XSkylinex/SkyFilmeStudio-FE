import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  ERROR_CODE,
  productionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { approvePlanMutationOptions } from '@/features/planner/api/approve-plan.mutation';
import { planningBudgetQueryOptions } from '@/features/planner/api/planning-budget.query';
import { productionQueryOptions } from '@/features/productions/api/production.query';
import { productionsQueryOptions } from '@/features/productions/api/productions.query';
import { buildProduction } from '../../../fixtures/production.fixture';
import { buildRuntimeBudgetReport } from '../../../fixtures/runtime-budget.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      approvePlanMutationOptions(PROJECT_ID, PRODUCTION_ID, queryClient),
    );

describe('approvePlanMutationOptions', () => {
  it('sends the approval with no body and no Content-Type header, and resolves to the transitioned production', async () => {
    const transitioned = buildProduction({
      id: PRODUCTION_ID,
      projectId: PROJECT_ID,
      state: 'STORYBOARDING',
    });

    let capturedRequest: Request | undefined;
    server.use(
      http.post(API_PATH.planningApproval(PRODUCTION_ID), ({ request }) => {
        capturedRequest = request;
        return HttpResponse.json(transitioned);
      }),
    );

    const queryClient = buildQueryClient();

    await expect(
      buildMutation(queryClient).execute(undefined),
    ).resolves.toEqual(transitioned);

    expect(capturedRequest?.method).toBe('POST');
    expect(capturedRequest?.headers.get('content-type')).toBeNull();
    await expect(capturedRequest?.text()).resolves.toBe('');
  });

  it('does not write the transitioned production into the detail cache before the server confirms it', async () => {
    const planning = buildProduction({
      id: PRODUCTION_ID,
      projectId: PROJECT_ID,
      state: 'PLANNING',
    });
    const transitioned = buildProduction({
      id: PRODUCTION_ID,
      projectId: PROJECT_ID,
      state: 'STORYBOARDING',
    });

    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.post(API_PATH.planningApproval(PRODUCTION_ID), async () => {
        await gate;
        return HttpResponse.json(transitioned);
      }),
    );

    const queryClient = buildQueryClient();
    queryClient.setQueryData(
      productionQueryOptions(PROJECT_ID, PRODUCTION_ID).queryKey,
      planning,
    );

    const pending = buildMutation(queryClient).execute(undefined);

    expect(
      queryClient.getQueryData(
        productionQueryOptions(PROJECT_ID, PRODUCTION_ID).queryKey,
      ),
    ).toEqual(planning);

    resolveResponse?.();
    await expect(pending).resolves.toEqual(transitioned);

    expect(
      queryClient.getQueryData(
        productionQueryOptions(PROJECT_ID, PRODUCTION_ID).queryKey,
      ),
    ).toEqual(planning);
  });

  it('invalidates the production detail, the productions list and the budget once the server confirms', async () => {
    const planning = buildProduction({
      id: PRODUCTION_ID,
      projectId: PROJECT_ID,
      state: 'PLANNING',
    });
    const transitioned = buildProduction({
      id: PRODUCTION_ID,
      projectId: PROJECT_ID,
      state: 'STORYBOARDING',
    });
    const budget = buildRuntimeBudgetReport({
      segments: [{ label: 'Act 1', targetDurationSeconds: 1_200 }],
    });

    let detailCalls = 0;
    let listCalls = 0;
    let budgetCalls = 0;
    server.use(
      http.get(API_PATH.production(PROJECT_ID, PRODUCTION_ID), () => {
        detailCalls += 1;
        return HttpResponse.json(detailCalls === 1 ? planning : transitioned);
      }),
      http.get(API_PATH.productions(PROJECT_ID), () => {
        listCalls += 1;
        return HttpResponse.json({
          items: [listCalls === 1 ? planning : transitioned],
        });
      }),
      http.get(API_PATH.planningBudget(PRODUCTION_ID), () => {
        budgetCalls += 1;
        return HttpResponse.json(budget);
      }),
      http.post(API_PATH.planningApproval(PRODUCTION_ID), () =>
        HttpResponse.json(transitioned),
      ),
    );

    const queryClient = buildQueryClient();

    await queryClient.fetchQuery(
      productionQueryOptions(PROJECT_ID, PRODUCTION_ID),
    );
    await queryClient.fetchQuery(productionsQueryOptions(PROJECT_ID));
    await queryClient.fetchQuery(planningBudgetQueryOptions(PRODUCTION_ID));

    await buildMutation(queryClient).execute(undefined);

    await queryClient.fetchQuery(
      productionQueryOptions(PROJECT_ID, PRODUCTION_ID),
    );
    await queryClient.fetchQuery(productionsQueryOptions(PROJECT_ID));
    await queryClient.fetchQuery(planningBudgetQueryOptions(PRODUCTION_ID));

    expect(detailCalls).toBe(2);
    expect(listCalls).toBe(2);
    expect(budgetCalls).toBe(2);
  });

  it('rejects with RUNTIME_BUDGET_OUT_OF_TOLERANCE when the plan does not add up', async () => {
    server.use(
      http.post(API_PATH.planningApproval(PRODUCTION_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: ERROR_CODE.RUNTIME_BUDGET_OUT_OF_TOLERANCE,
            message: 'The plan is outside its runtime tolerance.',
          },
          { status: 409 },
        ),
      ),
    );

    const queryClient = buildQueryClient();

    await expect(
      buildMutation(queryClient).execute(undefined),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: ERROR_CODE.RUNTIME_BUDGET_OUT_OF_TOLERANCE,
      status: 409,
    });
  });
});
