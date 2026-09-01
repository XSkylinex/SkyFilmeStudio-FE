import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { shotIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  shotKeyframeStatusQueryKey,
  shotKeyframeStatusQueryOptions,
} from '@/features/storyboard/api/shot-keyframe-status.query';
import { shotStoryboardQueryKey } from '@/features/storyboard/helpers/shot-storyboard-query-key';
import { SHOT_KEYFRAME_STATUS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildShotKeyframeStatus } from '../../../fixtures/shot-keyframe-status.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SHOT_ID = shotIdSchema.parse('55555555-5555-4555-8555-555555555555');

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('shotKeyframeStatusQueryKey', () => {
  it('keys by shot, so two shots never share a cached status', () => {
    const other = shotIdSchema.parse('99999999-9999-4999-8999-999999999999');

    expect(shotKeyframeStatusQueryKey(SHOT_ID)).toEqual([
      'shot-storyboard',
      SHOT_ID,
      'keyframe-status',
    ]);
    expect(shotKeyframeStatusQueryKey(SHOT_ID)).not.toEqual(
      shotKeyframeStatusQueryKey(other),
    );
  });

  it('extends the shared shot-storyboard prefix, so one invalidation reaches it', () => {
    const prefix = shotStoryboardQueryKey(SHOT_ID);

    expect(shotKeyframeStatusQueryKey(SHOT_ID).slice(0, prefix.length)).toEqual(
      prefix,
    );
  });
});

describe('shotKeyframeStatusQueryOptions', () => {
  it('uses SHOT_KEYFRAME_STATUS_STALE_TIME_MS as its staleTime', () => {
    expect(shotKeyframeStatusQueryOptions(SHOT_ID).staleTime).toBe(
      SHOT_KEYFRAME_STATUS_STALE_TIME_MS,
    );
  });

  it('fetches and returns the keyframe status unwrapped', async () => {
    const status = buildShotKeyframeStatus();
    server.use(
      http.get(API_PATH.shotKeyframeStatus(SHOT_ID), () =>
        HttpResponse.json(status),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        shotKeyframeStatusQueryOptions(SHOT_ID),
      ),
    ).resolves.toEqual(status);
  });

  it('refuses a status missing its server-authored detail sentence', async () => {
    const status = buildShotKeyframeStatus();
    server.use(
      http.get(API_PATH.shotKeyframeStatus(SHOT_ID), () =>
        HttpResponse.json({ ...status, detail: undefined }),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        shotKeyframeStatusQueryOptions(SHOT_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
