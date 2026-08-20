import { StudioError } from '@/lib/api/studio-error';
import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { JOB_STATE } from 'sky-filme-studio-be/contracts';
import type { JobState } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  renderJobQueryKey,
  renderJobQueryOptions,
} from '@/features/render-queue/api/render-job.query';
import {
  RENDER_JOB_POLL_FLOOR_MS,
  RENDER_JOB_STALE_TIME_MS,
} from '@/lib/query/query.constants';
import {
  buildRenderJob,
  FIXTURE_RENDER_JOB_ID,
} from '../../../fixtures/render-job.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

describe('renderJobQueryKey', () => {
  it('returns a stable key scoped to the render job id', () => {
    expect(renderJobQueryKey(FIXTURE_RENDER_JOB_ID)).toEqual([
      'render-jobs',
      FIXTURE_RENDER_JOB_ID,
    ]);
  });
});

describe('renderJobQueryOptions', () => {
  it('uses RENDER_JOB_STALE_TIME_MS as its staleTime', () => {
    expect(renderJobQueryOptions(FIXTURE_RENDER_JOB_ID).staleTime).toBe(
      RENDER_JOB_STALE_TIME_MS,
    );
  });

  it('fetches from the render job path and returns the parsed job', async () => {
    const renderJob = buildRenderJob({ state: JOB_STATE.RUNNING });

    server.use(
      http.get(API_PATH.renderJob(FIXTURE_RENDER_JOB_ID), () =>
        HttpResponse.json(renderJob),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(renderJobQueryOptions(FIXTURE_RENDER_JOB_ID)),
    ).resolves.toEqual(renderJob);
  });

  describe('refetchInterval', () => {
    const { refetchInterval } = renderJobQueryOptions(FIXTURE_RENDER_JOB_ID);

    if (typeof refetchInterval !== 'function') {
      throw new Error(
        'renderJobQueryOptions must define refetchInterval as a function',
      );
    }

    type ObservedQuery = Parameters<typeof refetchInterval>[0];

    const buildObservedQuery = (state?: JobState): ObservedQuery => {
      const data = state === undefined ? undefined : buildRenderJob({ state });

      return { state: { data } } as unknown as ObservedQuery;
    };

    it('stops polling once the job reaches a terminal state', () => {
      expect(refetchInterval(buildObservedQuery(JOB_STATE.SUCCEEDED))).toBe(
        false,
      );
    });

    it('keeps polling at the floor interval while the job is still running', () => {
      expect(refetchInterval(buildObservedQuery(JOB_STATE.RUNNING))).toBe(
        RENDER_JOB_POLL_FLOOR_MS,
      );
    });

    it('keeps polling at the floor interval before any data has arrived yet', () => {
      expect(refetchInterval(buildObservedQuery())).toBe(
        RENDER_JOB_POLL_FLOOR_MS,
      );
    });
  });
});

describe('renderJobQueryOptions polling against a failed request', () => {
  const { refetchInterval } = renderJobQueryOptions(FIXTURE_RENDER_JOB_ID);

  if (typeof refetchInterval !== 'function') {
    throw new Error(
      'renderJobQueryOptions must define refetchInterval as a function',
    );
  }

  type ObservedQuery = Parameters<typeof refetchInterval>[0];

  const buildFailedQuery = (error: unknown): ObservedQuery =>
    ({ state: { data: undefined, error } }) as unknown as ObservedQuery;

  it('stops polling a job the orchestrator says does not exist, instead of asking every fifteen seconds forever', () => {
    const notFound = new StudioError({
      kind: 'HTTP',
      messageKey: 'error.network',
      status: 404,
    });

    expect(refetchInterval(buildFailedQuery(notFound))).toBe(false);
  });

  it('keeps polling when the orchestrator is merely down, because that recovers', () => {
    const unreachable = new StudioError({
      kind: 'NETWORK',
      messageKey: 'error.network',
    });

    expect(refetchInterval(buildFailedQuery(unreachable))).toBe(
      RENDER_JOB_POLL_FLOOR_MS,
    );
  });
});
