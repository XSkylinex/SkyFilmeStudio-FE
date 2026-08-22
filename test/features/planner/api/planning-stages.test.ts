import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  PLANNING_STAGE,
  productionIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  planningStagesQueryKey,
  planningStagesQueryOptions,
} from '@/features/planner/api/planning-stages.query';
import { PLANNING_STAGES_STALE_TIME_MS } from '@/lib/query/query.constants';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('planningStagesQueryKey', () => {
  it('keys by production, so two productions never share a cached list', () => {
    const other = productionIdSchema.parse(
      '99999999-9999-4999-8999-999999999999',
    );

    expect(planningStagesQueryKey(PRODUCTION_ID)).toEqual([
      'planning-stages',
      PRODUCTION_ID,
    ]);
    expect(planningStagesQueryKey(PRODUCTION_ID)).not.toEqual(
      planningStagesQueryKey(other),
    );
  });
});

describe('planningStagesQueryOptions', () => {
  it('uses PLANNING_STAGES_STALE_TIME_MS as its staleTime', () => {
    expect(planningStagesQueryOptions(PRODUCTION_ID).staleTime).toBe(
      PLANNING_STAGES_STALE_TIME_MS,
    );
  });

  it('parses the bare array the orchestrator sends, with no page envelope', async () => {
    const stages = [
      PLANNING_STAGE.LOGLINE,
      PLANNING_STAGE.BEAT_SHEET,
      PLANNING_STAGE.SCENE_OUTLINE,
      PLANNING_STAGE.SCREENPLAY,
      PLANNING_STAGE.CONTINUITY_REVIEW,
      PLANNING_STAGE.TONE_REVIEW,
      PLANNING_STAGE.RUNTIME_ESTIMATE,
    ];
    server.use(
      http.get(API_PATH.planningStages(PRODUCTION_ID), () =>
        HttpResponse.json(stages),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        planningStagesQueryOptions(PRODUCTION_ID),
      ),
    ).resolves.toEqual(stages);
  });

  it('refuses a stage name the contract does not define', async () => {
    server.use(
      http.get(API_PATH.planningStages(PRODUCTION_ID), () =>
        HttpResponse.json(['NOT_A_REAL_STAGE']),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        planningStagesQueryOptions(PRODUCTION_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
