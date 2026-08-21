import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { API_PATH } from '@/lib/api/api.constants';
import {
  preflightQueryKey,
  preflightQueryOptions,
} from '@/shell/api/preflight.query';
import { PREFLIGHT_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildPreflightReport } from '../../fixtures/preflight-report.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

describe('preflightQueryKey', () => {
  it('returns a stable, predictable key', () => {
    expect(preflightQueryKey()).toEqual(['preflight']);
    expect(preflightQueryKey()).toEqual(preflightQueryKey());
  });
});

describe('preflightQueryOptions', () => {
  it('uses PREFLIGHT_STALE_TIME_MS as its staleTime', () => {
    expect(preflightQueryOptions().staleTime).toBe(PREFLIGHT_STALE_TIME_MS);
  });

  it('fetches from the preflight path and returns the parsed report', async () => {
    const preflightReport = buildPreflightReport({ passed: false });

    server.use(
      http.get(API_PATH.preflight(), () => HttpResponse.json(preflightReport)),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(preflightQueryOptions()),
    ).resolves.toEqual(preflightReport);
  });
});
