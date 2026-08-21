import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { API_PATH } from '@/lib/api/api.constants';
import {
  captureGuideQueryKey,
  captureGuideQueryOptions,
} from '@/features/assets/api/capture-guide.query';
import { CAPTURE_GUIDE_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildCaptureGuide } from '../../../fixtures/capture-guide.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

describe('captureGuideQueryOptions', () => {
  it('returns a stable key and the long staleTime a fixed guide deserves', () => {
    expect(captureGuideQueryKey()).toEqual(['capture-guide']);
    expect(captureGuideQueryOptions().staleTime).toBe(
      CAPTURE_GUIDE_STALE_TIME_MS,
    );
  });

  it('returns the guide the orchestrator sent', async () => {
    const guide = buildCaptureGuide();
    server.use(
      http.get(API_PATH.captureGuide(), () => HttpResponse.json(guide)),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(captureGuideQueryOptions()),
    ).resolves.toEqual(guide);
  });

  it('refuses a guide that claims it cannot be bypassed', async () => {
    server.use(
      http.get(API_PATH.captureGuide(), () =>
        HttpResponse.json({
          bypassable: false,
          views: [{ id: 'FRONT', label: 'Front', why: 'why', optional: true }],
          recommendations: [{ id: 'LIGHT', advice: 'advice' }],
        }),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(captureGuideQueryOptions()),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
