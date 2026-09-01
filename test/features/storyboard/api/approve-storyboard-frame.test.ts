import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  ERROR_CODE,
  artifactIdSchema,
  shotIdSchema,
  storyboardFrameIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { approveStoryboardFrameMutationOptions } from '@/features/storyboard/api/approve-storyboard-frame.mutation';
import { shotKeyframeStatusQueryOptions } from '@/features/storyboard/api/shot-keyframe-status.query';
import { shotStoryboardFramesQueryOptions } from '@/features/storyboard/api/shot-storyboard-frames.query';
import { shotStoryboardQueryKey } from '@/features/storyboard/helpers/shot-storyboard-query-key';
import { buildShotKeyframeStatus } from '../../../fixtures/shot-keyframe-status.fixture';
import { buildStoryboardFrame } from '../../../fixtures/storyboard-frame.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

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
      approveStoryboardFrameMutationOptions(SHOT_ID, queryClient),
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

  it('does not invalidate the shot-storyboard cache before the server confirms the approval', async () => {
    const status = buildShotKeyframeStatus({ videoPermitted: true });

    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.post(API_PATH.storyboardFrameApproval(FRAME_ID), async () => {
        await gate;
        return HttpResponse.json(status);
      }),
    );

    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    const pending = buildMutation(queryClient).execute(FRAME_ID);
    await Promise.resolve();

    expect(invalidate).not.toHaveBeenCalled();

    resolveResponse?.();
    await expect(pending).resolves.toEqual(status);

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: shotStoryboardQueryKey(SHOT_ID),
    });
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

  it('rejects with STORYBOARD_FRAME_IMMUTABLE when the frame can no longer be decided', async () => {
    server.use(
      http.post(API_PATH.storyboardFrameApproval(FRAME_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: ERROR_CODE.STORYBOARD_FRAME_IMMUTABLE,
            message: 'This storyboard frame can no longer be decided.',
          },
          { status: 409 },
        ),
      ),
    );

    const queryClient = buildQueryClient();

    await expect(
      buildMutation(queryClient).execute(FRAME_ID),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: ERROR_CODE.STORYBOARD_FRAME_IMMUTABLE,
      status: 409,
    });
  });
});
