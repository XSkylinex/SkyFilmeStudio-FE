import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  dialogueLineIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { dialogueLineSpeechQueryOptions } from '@/features/audio/api/dialogue-line-speech.query';
import {
  sceneDialogueLinesQueryKey,
  sceneDialogueLinesQueryOptions,
} from '@/features/audio/api/scene-dialogue-lines.query';
import { synthesiseSpeechMutationOptions } from '@/features/audio/api/synthesise-speech.mutation';
import { dialogueLineQueryKey } from '@/features/audio/helpers/dialogue-line-query-key';
import { buildDialogueLine } from '../../../fixtures/dialogue-line.fixture';
import { buildSpeechSynthesis } from '../../../fixtures/speech-synthesis.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const LINE_ID = dialogueLineIdSchema.parse(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      synthesiseSpeechMutationOptions(LINE_ID, SCENE_ID, queryClient),
    );

describe('synthesiseSpeechMutationOptions', () => {
  it('sends the pass, because a draft and a final are different work rather than a retry', async () => {
    let capturedBody: unknown;
    server.use(
      http.post(API_PATH.dialogueLineSpeech(LINE_ID), async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({ renderJobId: 'ignored', attempt: 1 });
      }),
    );

    await buildMutation(buildQueryClient()).execute({ pass: 'FINAL' });

    expect(capturedBody).toEqual({ pass: 'FINAL' });
  });

  it('refuses a pass the contract does not define before anything is sent', async () => {
    let reached = false;
    server.use(
      http.post(API_PATH.dialogueLineSpeech(LINE_ID), () => {
        reached = true;
        return HttpResponse.json({});
      }),
    );

    await expect(
      buildMutation(buildQueryClient()).execute({
        pass: 'PREVIEW',
      } as unknown as { pass: 'DRAFT' }),
    ).rejects.toBeInstanceOf(Error);
    expect(reached).toBe(false);
  });

  it('shows nothing the server has not confirmed while the request is in flight', async () => {
    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.get(API_PATH.dialogueLineSpeech(LINE_ID), () =>
        HttpResponse.json([buildSpeechSynthesis()]),
      ),
      http.get(API_PATH.sceneDialogueLines(SCENE_ID), () =>
        HttpResponse.json({ items: [buildDialogueLine()] }),
      ),
      http.post(API_PATH.dialogueLineSpeech(LINE_ID), async () => {
        await gate;
        return HttpResponse.json({ renderJobId: 'x', attempt: 2 });
      }),
    );

    const queryClient = buildQueryClient();
    await queryClient.fetchQuery(dialogueLineSpeechQueryOptions(LINE_ID));
    await queryClient.fetchQuery(sceneDialogueLinesQueryOptions(SCENE_ID));

    const readCache = (): string =>
      JSON.stringify([
        queryClient.getQueriesData({ queryKey: dialogueLineQueryKey(LINE_ID) }),
        queryClient.getQueriesData({
          queryKey: sceneDialogueLinesQueryKey(SCENE_ID),
        }),
      ]);

    const before = readCache();
    const pending = buildMutation(queryClient).execute({ pass: 'DRAFT' });
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(readCache()).toBe(before);

    resolveResponse?.();
    await pending;
  });

  it('re-reads the scene list, which a prefix invalidation on the line cannot reach', async () => {
    let lineCalls = 0;
    server.use(
      http.get(API_PATH.sceneDialogueLines(SCENE_ID), () => {
        lineCalls += 1;
        return HttpResponse.json({ items: [buildDialogueLine()] });
      }),
      http.post(API_PATH.dialogueLineSpeech(LINE_ID), () =>
        HttpResponse.json({ renderJobId: 'x', attempt: 1 }),
      ),
    );

    const queryClient = buildQueryClient();

    await queryClient.fetchQuery(sceneDialogueLinesQueryOptions(SCENE_ID));
    await buildMutation(queryClient).execute({ pass: 'DRAFT' });
    await queryClient.fetchQuery(sceneDialogueLinesQueryOptions(SCENE_ID));

    expect(lineCalls).toBe(2);
  });

  it('surfaces the approved-line refusal as the typed code the orchestrator raises', async () => {
    server.use(
      http.post(API_PATH.dialogueLineSpeech(LINE_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'DIALOGUE_AUDIO_IMMUTABLE',
            message: 'Dialogue line is approved.',
          },
          { status: 409 },
        ),
      ),
    );

    await expect(
      buildMutation(buildQueryClient()).execute({ pass: 'DRAFT' }),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: 'DIALOGUE_AUDIO_IMMUTABLE',
    });
  });
});
