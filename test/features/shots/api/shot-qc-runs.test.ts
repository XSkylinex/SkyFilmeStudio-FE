import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { qcRunIdSchema, shotIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  shotQcRunsQueryKey,
  shotQcRunsQueryOptions,
} from '@/features/shots/api/shot-qc-runs.query';
import { shotQcQueryKey } from '@/features/shots/helpers/shot-qc-query-key';
import { SHOT_QC_RUNS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildQcRun } from '../../../fixtures/qc-run.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SHOT_ID = shotIdSchema.parse('55555555-5555-4555-8555-555555555555');

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('shotQcRunsQueryKey', () => {
  it('extends the shot-qc prefix, so one invalidation reaches every QC read for a shot', () => {
    expect(shotQcRunsQueryKey(SHOT_ID).slice(0, 2)).toEqual(
      shotQcQueryKey(SHOT_ID),
    );
  });
});

describe('shotQcRunsQueryOptions', () => {
  it('uses SHOT_QC_RUNS_STALE_TIME_MS as its staleTime', () => {
    expect(shotQcRunsQueryOptions(SHOT_ID).staleTime).toBe(
      SHOT_QC_RUNS_STALE_TIME_MS,
    );
  });

  it('parses every run kind and keeps the per-check results with what was observed', async () => {
    const runs = [
      buildQcRun(),
      buildQcRun({
        id: qcRunIdSchema.parse('bbbbbbbb-2222-4bbb-8bbb-bbbbbbbbbbbb'),
        kind: 'SUBJECT_CONSISTENCY',
        outcome: 'WARN',
        checks: [],
      }),
    ];
    server.use(
      http.get(API_PATH.shotQcRuns(SHOT_ID), () => HttpResponse.json(runs)),
    );

    const result = await queryClientWithoutRetry().fetchQuery(
      shotQcRunsQueryOptions(SHOT_ID),
    );

    expect(result.map((run) => run.outcome)).toEqual(['PASS', 'WARN']);
    expect(result[0]?.checks[1]?.observed).toBe('6.02 s');
  });

  it('refuses a verdict outside PASS, WARN, FAIL and SKIPPED, so an approval word can never arrive here', async () => {
    server.use(
      http.get(API_PATH.shotQcRuns(SHOT_ID), () =>
        HttpResponse.json([{ ...buildQcRun(), outcome: 'APPROVED' }]),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(shotQcRunsQueryOptions(SHOT_ID)),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
