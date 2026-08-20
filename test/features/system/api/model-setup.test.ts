import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { API_PATH } from '@/lib/api/api.constants';
import {
  modelSetupQueryKey,
  modelSetupQueryOptions,
} from '@/features/system/api/model-setup.query';
import { MODEL_SETUP_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildModelSetupReport } from '../../../fixtures/model-setup-report.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

describe('modelSetupQueryKey', () => {
  it('returns a stable, predictable key', () => {
    expect(modelSetupQueryKey()).toEqual(['model-setup']);
    expect(modelSetupQueryKey()).toEqual(modelSetupQueryKey());
  });
});

describe('modelSetupQueryOptions', () => {
  it('uses MODEL_SETUP_STALE_TIME_MS as its staleTime', () => {
    expect(modelSetupQueryOptions().staleTime).toBe(MODEL_SETUP_STALE_TIME_MS);
  });

  it('fetches from the model setup path and returns the parsed report', async () => {
    const modelSetupReport = buildModelSetupReport({ ready: false });

    server.use(
      http.get(API_PATH.modelSetup(), () =>
        HttpResponse.json(modelSetupReport),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(modelSetupQueryOptions()),
    ).resolves.toEqual(modelSetupReport);
  });
});
