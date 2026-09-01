import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  ERROR_CODE,
  shotIdSchema,
  storyboardFrameIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { rejectStoryboardFrameMutationOptions } from '@/features/storyboard/api/reject-storyboard-frame.mutation';
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

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      rejectStoryboardFrameMutationOptions(SHOT_ID, queryClient),
    );

describe('rejectStoryboardFrameMutationOptions', () => {
  it('sends the rejection with no body and no Content-Type header, and resolves to the keyframe status', async () => {
    const status = buildShotKeyframeStatus({
      videoPermitted: false,
      detail: 'The candidate keyframe was rejected; a new attempt is needed.',
    });

    let capturedRequest: Request | undefined;
    server.use(
      http.delete(API_PATH.storyboardFrameApproval(FRAME_ID), ({ request }) => {
        capturedRequest = request;
        return HttpResponse.json(status);
      }),
    );

    const queryClient = buildQueryClient();

    await expect(buildMutation(queryClient).execute(FRAME_ID)).resolves.toEqual(
      status,
    );

    expect(capturedRequest?.method).toBe('DELETE');
    expect(capturedRequest?.headers.get('content-type')).toBeNull();
    await expect(capturedRequest?.text()).resolves.toBe('');
  });

  it('does not invalidate the shot-storyboard cache before the server confirms the rejection', async () => {
    const status = buildShotKeyframeStatus({ videoPermitted: false });

    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.delete(API_PATH.storyboardFrameApproval(FRAME_ID), async () => {
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
    const rejectedFrame = buildStoryboardFrame({ attempt: 1 });
    const beforeStatus = buildShotKeyframeStatus({
      videoPermitted: true,
      detail: 'The approved keyframe anchors the video render.',
    });
    const afterStatus = buildShotKeyframeStatus({
      videoPermitted: false,
      detail: 'The candidate keyframe was rejected; a new attempt is needed.',
    });

    let framesCalls = 0;
    let statusCalls = 0;
    server.use(
      http.get(API_PATH.shotStoryboardFrames(SHOT_ID), () => {
        framesCalls += 1;
        return HttpResponse.json([rejectedFrame]);
      }),
      http.get(API_PATH.shotKeyframeStatus(SHOT_ID), () => {
        statusCalls += 1;
        return HttpResponse.json(
          statusCalls === 1 ? beforeStatus : afterStatus,
        );
      }),
      http.delete(API_PATH.storyboardFrameApproval(FRAME_ID), () =>
        HttpResponse.json(afterStatus),
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

  it('rejects with STORYBOARD_NOT_APPROVED when there is nothing to reject', async () => {
    server.use(
      http.delete(API_PATH.storyboardFrameApproval(FRAME_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: ERROR_CODE.STORYBOARD_NOT_APPROVED,
            message: 'This storyboard frame has not been approved.',
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
      code: ERROR_CODE.STORYBOARD_NOT_APPROVED,
      status: 409,
    });
  });
});
