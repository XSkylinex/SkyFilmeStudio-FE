import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  dialogueLineIdSchema,
  sceneIdSchema,
  speechSynthesisIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { approveDialogueAudioMutationOptions } from '@/features/audio/api/approve-dialogue-audio.mutation';
import { unapproveDialogueAudioMutationOptions } from '@/features/audio/api/unapprove-dialogue-audio.mutation';
import { sceneDialogueLinesQueryOptions } from '@/features/audio/api/scene-dialogue-lines.query';
import { dialogueLineSpeechQueryOptions } from '@/features/audio/api/dialogue-line-speech.query';
import { dialogueLineQueryKey } from '@/features/audio/helpers/dialogue-line-query-key';
import { buildDialogueLine } from '../../../fixtures/dialogue-line.fixture';
import { buildSpeechSynthesis } from '../../../fixtures/speech-synthesis.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const LINE_ID = dialogueLineIdSchema.parse(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
);

const SYNTHESIS_ID = speechSynthesisIdSchema.parse(
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const approval = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      approveDialogueAudioMutationOptions(LINE_ID, SCENE_ID, queryClient),
    );

const removal = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      unapproveDialogueAudioMutationOptions(LINE_ID, SCENE_ID, queryClient),
    );

describe('approveDialogueAudioMutationOptions', () => {
  it('sends no body, because the route approves the file the line already points at', async () => {
    let capturedRequest: Request | undefined;
    server.use(
      http.post(API_PATH.dialogueLineSpeechApproval(LINE_ID), ({ request }) => {
        capturedRequest = request;
        return HttpResponse.json(
          buildDialogueLine({
            approved: true,
            approvedSynthesisId: SYNTHESIS_ID,
          }),
        );
      }),
    );

    await approval(buildQueryClient()).execute(undefined);

    expect(capturedRequest?.method).toBe('POST');
    expect(capturedRequest?.headers.get('content-type')).toBeNull();
    await expect(capturedRequest?.text()).resolves.toBe('');
  });

  it('refreshes the scene list too, so the approved line stops offering to be re-voiced', async () => {
    let lineCalls = 0;
    server.use(
      http.get(API_PATH.sceneDialogueLines(SCENE_ID), () => {
        lineCalls += 1;
        return HttpResponse.json({
          items: [
            buildDialogueLine(
              lineCalls === 1
                ? {}
                : { approved: true, approvedSynthesisId: SYNTHESIS_ID },
            ),
          ],
        });
      }),
      http.post(API_PATH.dialogueLineSpeechApproval(LINE_ID), () =>
        HttpResponse.json(
          buildDialogueLine({
            approved: true,
            approvedSynthesisId: SYNTHESIS_ID,
          }),
        ),
      ),
    );

    const queryClient = buildQueryClient();

    const before = await queryClient.fetchQuery(
      sceneDialogueLinesQueryOptions(SCENE_ID),
    );
    expect(before.items[0]?.approved).toBe(false);

    await approval(queryClient).execute(undefined);

    const after = await queryClient.fetchQuery(
      sceneDialogueLinesQueryOptions(SCENE_ID),
    );

    expect(lineCalls).toBe(2);
    expect(after.items[0]?.approved).toBe(true);
  });

  it('shows nothing the server has not confirmed while the approval is in flight', async () => {
    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.get(API_PATH.dialogueLineSpeech(LINE_ID), () =>
        HttpResponse.json([buildSpeechSynthesis()]),
      ),
      http.post(API_PATH.dialogueLineSpeechApproval(LINE_ID), async () => {
        await gate;
        return HttpResponse.json(
          buildDialogueLine({
            approved: true,
            approvedSynthesisId: SYNTHESIS_ID,
          }),
        );
      }),
    );

    const queryClient = buildQueryClient();
    await queryClient.fetchQuery(dialogueLineSpeechQueryOptions(LINE_ID));

    const readCache = (): string =>
      JSON.stringify(
        queryClient.getQueriesData({ queryKey: dialogueLineQueryKey(LINE_ID) }),
      );

    const before = readCache();
    const pending = approval(queryClient).execute(undefined);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(readCache()).toBe(before);

    resolveResponse?.();
    await pending;
  });

  it('surfaces the never-synthesised refusal as the codeless 400 that guard really returns', async () => {
    server.use(
      http.post(API_PATH.dialogueLineSpeechApproval(LINE_ID), () =>
        HttpResponse.json(
          {
            statusCode: 400,
            error: 'Bad Request',
            message:
              'Dialogue line has never been synthesised, so there is no audio to approve.',
          },
          { status: 400 },
        ),
      ),
    );

    await expect(
      approval(buildQueryClient()).execute(undefined),
    ).rejects.toMatchObject({ kind: 'HTTP', status: 400, code: undefined });
  });
});

describe('unapproveDialogueAudioMutationOptions', () => {
  it('deletes the approval, which is what re-opens a line for re-voicing', async () => {
    let capturedRequest: Request | undefined;
    server.use(
      http.delete(
        API_PATH.dialogueLineSpeechApproval(LINE_ID),
        ({ request }) => {
          capturedRequest = request;
          return HttpResponse.json(buildDialogueLine({ approved: false }));
        },
      ),
    );

    const line = await removal(buildQueryClient()).execute(undefined);

    expect(capturedRequest?.method).toBe('DELETE');
    expect(line.approved).toBe(false);
    expect(line.approvedSynthesisId).toBeUndefined();
  });
});
