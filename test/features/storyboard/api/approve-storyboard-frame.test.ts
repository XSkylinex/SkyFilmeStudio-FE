import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  artifactIdSchema,
  sceneIdSchema,
  shotIdSchema,
  storyboardFrameIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { approveStoryboardFrameMutationOptions } from '@/features/storyboard/api/approve-storyboard-frame.mutation';
import { shotKeyframeStatusQueryOptions } from '@/features/storyboard/api/shot-keyframe-status.query';
import { sceneShotsQueryOptions } from '@/features/storyboard/api/scene-shots.query';
import { shotStoryboardFramesQueryOptions } from '@/features/storyboard/api/shot-storyboard-frames.query';
import { shotStoryboardQueryKey } from '@/features/storyboard/helpers/shot-storyboard-query-key';
import { buildShotKeyframeStatus } from '../../../fixtures/shot-keyframe-status.fixture';
import { buildShot } from '../../../fixtures/shot.fixture';
import { buildStoryboardFrame } from '../../../fixtures/storyboard-frame.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const SHOT_ID = shotIdSchema.parse('55555555-5555-4555-8555-555555555555');

const FRAME_ID = storyboardFrameIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);

const APPROVED_KEYFRAME_ARTIFACT_ID = artifactIdSchema.parse(
  '88888888-8888-4888-8888-888888888888',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      approveStoryboardFrameMutationOptions(SHOT_ID, SCENE_ID, queryClient),
    );

describe('approveStoryboardFrameMutationOptions', () => {
  it('sends the approval with no body and no Content-Type header, and resolves to the keyframe status', async () => {
    const status = buildShotKeyframeStatus({
      keyframeRequirement: 'REQUIRED_BY_SUBJECT',
      approvedKeyframeId: APPROVED_KEYFRAME_ARTIFACT_ID,
      videoPermitted: true,
      detail: 'The approved keyframe now anchors the video render.',
    });

    let capturedRequest: Request | undefined;
    server.use(
      http.post(API_PATH.storyboardFrameApproval(FRAME_ID), ({ request }) => {
        capturedRequest = request;
        return HttpResponse.json(status);
      }),
    );

    const queryClient = buildQueryClient();

    await expect(buildMutation(queryClient).execute(FRAME_ID)).resolves.toEqual(
      status,
    );

    expect(capturedRequest?.method).toBe('POST');
    expect(capturedRequest?.headers.get('content-type')).toBeNull();
    await expect(capturedRequest?.text()).resolves.toBe('');
  });

  it('shows nothing the server has not confirmed while the approval is in flight', async () => {
    const before = buildShotKeyframeStatus({
      videoPermitted: false,
      detail: 'No keyframe has been approved for this shot yet.',
    });
    const after = buildShotKeyframeStatus({
      approvedKeyframeId: APPROVED_KEYFRAME_ARTIFACT_ID,
      videoPermitted: true,
      detail: 'The approved keyframe now anchors the video render.',
    });

    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.get(API_PATH.shotKeyframeStatus(SHOT_ID), () =>
        HttpResponse.json(before),
      ),
      http.get(API_PATH.shotStoryboardFrames(SHOT_ID), () =>
        HttpResponse.json([buildStoryboardFrame()]),
      ),
      http.post(API_PATH.storyboardFrameApproval(FRAME_ID), async () => {
        await gate;
        return HttpResponse.json(after);
      }),
    );

    const queryClient = buildQueryClient();
    await queryClient.fetchQuery(shotKeyframeStatusQueryOptions(SHOT_ID));
    await queryClient.fetchQuery(shotStoryboardFramesQueryOptions(SHOT_ID));

    const readCache = (): string =>
      JSON.stringify(
        queryClient.getQueriesData({
          queryKey: shotStoryboardQueryKey(SHOT_ID),
        }),
      );

    const beforeMutating = readCache();
    const pending = buildMutation(queryClient).execute(FRAME_ID);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(readCache()).toBe(beforeMutating);

    resolveResponse?.();
    await expect(pending).resolves.toEqual(after);
  });

  it('refreshes the shot row too, because approving writes the shot and not only the frame', async () => {
    const confirmedStatus = buildShotKeyframeStatus({
      approvedKeyframeId: APPROVED_KEYFRAME_ARTIFACT_ID,
      videoPermitted: true,
      detail: 'The approved keyframe now anchors the video render.',
    });

    let shotCalls = 0;
    server.use(
      http.get(API_PATH.sceneShots(SCENE_ID), () => {
        shotCalls += 1;
        return HttpResponse.json([
          buildShot({
            state: shotCalls === 1 ? 'STORYBOARD_READY' : 'STORYBOARD_APPROVED',
          }),
        ]);
      }),
      http.post(API_PATH.storyboardFrameApproval(FRAME_ID), () =>
        HttpResponse.json(confirmedStatus),
      ),
    );

    const queryClient = buildQueryClient();

    const before = await queryClient.fetchQuery(
      sceneShotsQueryOptions(SCENE_ID),
    );
    expect(before[0]?.state).toBe('STORYBOARD_READY');

    await buildMutation(queryClient).execute(FRAME_ID);

    const after = await queryClient.fetchQuery(
      sceneShotsQueryOptions(SCENE_ID),
    );

    expect(shotCalls).toBe(2);
    expect(after[0]?.state).toBe('STORYBOARD_APPROVED');
  });

  it('invalidating the shared prefix refreshes both the frame list and the keyframe status', async () => {
    const pendingFrame = buildStoryboardFrame({ attempt: 1 });
    const approvedStatus = buildShotKeyframeStatus({
      videoPermitted: false,
      detail: 'No keyframe has been approved for this shot yet.',
    });
    const confirmedStatus = buildShotKeyframeStatus({
      approvedKeyframeId: pendingFrame.artifactId,
      videoPermitted: true,
      detail: 'The approved keyframe now anchors the video render.',
    });

    let framesCalls = 0;
    let statusCalls = 0;
    server.use(
      http.get(API_PATH.shotStoryboardFrames(SHOT_ID), () => {
        framesCalls += 1;
        return HttpResponse.json([pendingFrame]);
      }),
      http.get(API_PATH.shotKeyframeStatus(SHOT_ID), () => {
        statusCalls += 1;
        return HttpResponse.json(
          statusCalls === 1 ? approvedStatus : confirmedStatus,
        );
      }),
      http.post(API_PATH.storyboardFrameApproval(FRAME_ID), () =>
        HttpResponse.json(confirmedStatus),
      ),
    );

    const queryClient = buildQueryClient();

    await queryClient.fetchQuery(shotStoryboardFramesQueryOptions(SHOT_ID));
    await queryClient.fetchQuery(shotKeyframeStatusQueryOptions(SHOT_ID));

    await buildMutation(queryClient).execute(FRAME_ID);

    await queryClient.fetchQuery(shotStoryboardFramesQueryOptions(SHOT_ID));
    await queryClient.fetchQuery(shotKeyframeStatusQueryOptions(SHOT_ID));

    expect(framesCalls).toBe(2);
    expect(statusCalls).toBe(2);
  });

  it('surfaces the draft refusal as a codeless 400, which is what that guard actually returns', async () => {
    server.use(
      http.post(API_PATH.storyboardFrameApproval(FRAME_ID), () =>
        HttpResponse.json(
          {
            statusCode: 400,
            error: 'Bad Request',
            message:
              'Frame is a DRAFT, and only a KEYFRAME may anchor image-to-video.',
          },
          { status: 400 },
        ),
      ),
    );

    const queryClient = buildQueryClient();

    await expect(
      buildMutation(queryClient).execute(FRAME_ID),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      status: 400,
      code: undefined,
    });
  });
});
