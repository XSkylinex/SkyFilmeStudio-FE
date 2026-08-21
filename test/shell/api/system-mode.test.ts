import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { API_PATH } from '@/lib/api/api.constants';
import {
  systemModeQueryKey,
  systemModeQueryOptions,
} from '@/shell/api/system-mode.query';
import {
  SYSTEM_MODE_POLL_FLOOR_MS,
  SYSTEM_MODE_STALE_TIME_MS,
} from '@/lib/query/query.constants';
import { buildSystemMode } from '../../fixtures/system-mode.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

describe('systemModeQueryKey', () => {
  it('returns a stable, predictable key', () => {
    expect(systemModeQueryKey()).toEqual(['system', 'mode']);
    expect(systemModeQueryKey()).toEqual(systemModeQueryKey());
  });
});

describe('systemModeQueryOptions', () => {
  it('uses SYSTEM_MODE_STALE_TIME_MS as its staleTime', () => {
    expect(systemModeQueryOptions().staleTime).toBe(SYSTEM_MODE_STALE_TIME_MS);
  });

  it('re-asks on a floor far shorter than its staleTime, so the mode cannot go half an hour stale', () => {
    expect(systemModeQueryOptions().refetchInterval).toBe(
      SYSTEM_MODE_POLL_FLOOR_MS,
    );
    expect(SYSTEM_MODE_POLL_FLOOR_MS).toBeLessThan(SYSTEM_MODE_STALE_TIME_MS);
  });

  it('fetches from the system mode path and returns the parsed body', async () => {
    const systemMode = buildSystemMode({ operatingMode: 'LOCAL_ONLY' });

    server.use(
      http.get(API_PATH.systemMode(), () => HttpResponse.json(systemMode)),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(systemModeQueryOptions()),
    ).resolves.toEqual(systemMode);
  });
});
