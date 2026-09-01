import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { storyboardFrameIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  frameComparisonQueryKey,
  frameComparisonQueryOptions,
} from '@/features/storyboard/api/frame-comparison.query';
import { FRAME_COMPARISON_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildFrameComparison } from '../../../fixtures/frame-comparison.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const FRAME_ID = storyboardFrameIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('frameComparisonQueryKey', () => {
  it('keys by frame, so two frames never share a cached comparison', () => {
    const other = storyboardFrameIdSchema.parse(
      '99999999-9999-4999-8999-999999999999',
    );

    expect(frameComparisonQueryKey(FRAME_ID)).toEqual([
      'frame-comparison',
      FRAME_ID,
    ]);
    expect(frameComparisonQueryKey(FRAME_ID)).not.toEqual(
      frameComparisonQueryKey(other),
    );
  });
});

describe('frameComparisonQueryOptions', () => {
  it('treats a frame comparison as immutable for a given frame id', () => {
    expect(frameComparisonQueryOptions(FRAME_ID).staleTime).toBe(
      FRAME_COMPARISON_STALE_TIME_MS,
    );
  });

  it('fetches and returns the comparison unwrapped', async () => {
    const comparison = buildFrameComparison();
    server.use(
      http.get(API_PATH.storyboardFrameComparison(FRAME_ID), () =>
        HttpResponse.json(comparison),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        frameComparisonQueryOptions(FRAME_ID),
      ),
    ).resolves.toEqual(comparison);
  });

  it('refuses a comparison whose anchor is missing its required kind', async () => {
    const comparison = buildFrameComparison();
    server.use(
      http.get(API_PATH.storyboardFrameComparison(FRAME_ID), () =>
        HttpResponse.json({
          ...comparison,
          anchors: [
            {
              anchor: { ...comparison.anchors[0]?.anchor, kind: undefined },
            },
          ],
        }),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        frameComparisonQueryOptions(FRAME_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
