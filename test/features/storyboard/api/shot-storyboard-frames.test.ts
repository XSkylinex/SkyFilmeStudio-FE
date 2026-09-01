import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  shotIdSchema,
  storyboardFrameIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  shotStoryboardFramesQueryKey,
  shotStoryboardFramesQueryOptions,
} from '@/features/storyboard/api/shot-storyboard-frames.query';
import { shotStoryboardQueryKey } from '@/features/storyboard/helpers/shot-storyboard-query-key';
import { SHOT_STORYBOARD_FRAMES_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildStoryboardFrame } from '../../../fixtures/storyboard-frame.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SHOT_ID = shotIdSchema.parse('55555555-5555-4555-8555-555555555555');

const OTHER_FRAME_ID = storyboardFrameIdSchema.parse(
  '99999999-9999-4999-8999-999999999999',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('shotStoryboardFramesQueryKey', () => {
  it('keys by shot, so two shots never share a cached list', () => {
    const other = shotIdSchema.parse('99999999-9999-4999-8999-999999999999');

    expect(shotStoryboardFramesQueryKey(SHOT_ID)).toEqual([
      'shot-storyboard',
      SHOT_ID,
      'frames',
    ]);
    expect(shotStoryboardFramesQueryKey(SHOT_ID)).not.toEqual(
      shotStoryboardFramesQueryKey(other),
    );
  });

  it('extends the shared shot-storyboard prefix, so one invalidation reaches it', () => {
    const prefix = shotStoryboardQueryKey(SHOT_ID);

    expect(
      shotStoryboardFramesQueryKey(SHOT_ID).slice(0, prefix.length),
    ).toEqual(prefix);
  });
});

describe('shotStoryboardFramesQueryOptions', () => {
  it('uses SHOT_STORYBOARD_FRAMES_STALE_TIME_MS as its staleTime', () => {
    expect(shotStoryboardFramesQueryOptions(SHOT_ID).staleTime).toBe(
      SHOT_STORYBOARD_FRAMES_STALE_TIME_MS,
    );
  });

  it('parses the bare array the orchestrator sends, with no page envelope', async () => {
    const frames = [
      buildStoryboardFrame({ attempt: 1 }),
      buildStoryboardFrame({
        id: OTHER_FRAME_ID,
        attempt: 2,
      }),
    ];
    server.use(
      http.get(API_PATH.shotStoryboardFrames(SHOT_ID), () =>
        HttpResponse.json(frames),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        shotStoryboardFramesQueryOptions(SHOT_ID),
      ),
    ).resolves.toEqual(frames);
  });

  it('refuses a frame missing its required artifactId', async () => {
    const frame = buildStoryboardFrame();
    server.use(
      http.get(API_PATH.shotStoryboardFrames(SHOT_ID), () =>
        HttpResponse.json([{ ...frame, artifactId: undefined }]),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        shotStoryboardFramesQueryOptions(SHOT_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
