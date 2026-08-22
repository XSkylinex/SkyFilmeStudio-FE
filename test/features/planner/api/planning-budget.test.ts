import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  planningBudgetQueryKey,
  planningBudgetQueryOptions,
} from '@/features/planner/api/planning-budget.query';
import { PLANNING_BUDGET_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildRuntimeBudgetReport } from '../../../fixtures/runtime-budget.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('planningBudgetQueryKey', () => {
  it('keys by production, so two productions never share a cached report', () => {
    const other = productionIdSchema.parse(
      '99999999-9999-4999-8999-999999999999',
    );

    expect(planningBudgetQueryKey(PRODUCTION_ID)).toEqual([
      'planning-budget',
      PRODUCTION_ID,
    ]);
    expect(planningBudgetQueryKey(PRODUCTION_ID)).not.toEqual(
      planningBudgetQueryKey(other),
    );
  });
});

describe('planningBudgetQueryOptions', () => {
  it('treats the budget as stale far sooner than the stages it is planned alongside', () => {
    expect(planningBudgetQueryOptions(PRODUCTION_ID).staleTime).toBe(
      PLANNING_BUDGET_STALE_TIME_MS,
    );
  });

  it('fetches and returns the runtime budget report unwrapped', async () => {
    const report = buildRuntimeBudgetReport({
      segments: [
        { label: 'Act 1', targetDurationSeconds: 300 },
        { label: 'Act 2', targetDurationSeconds: 900 },
      ],
    });
    server.use(
      http.get(API_PATH.planningBudget(PRODUCTION_ID), () =>
        HttpResponse.json(report),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        planningBudgetQueryOptions(PRODUCTION_ID),
      ),
    ).resolves.toEqual(report);
  });

  it('refuses a budget report missing its server-authored detail sentence', async () => {
    const report = buildRuntimeBudgetReport({
      segments: [{ label: 'Act 1', targetDurationSeconds: 1_200 }],
    });
    server.use(
      http.get(API_PATH.planningBudget(PRODUCTION_ID), () =>
        HttpResponse.json({ ...report, detail: undefined }),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        planningBudgetQueryOptions(PRODUCTION_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
