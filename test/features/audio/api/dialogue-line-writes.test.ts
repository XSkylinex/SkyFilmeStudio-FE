import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  dialogueLineIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { createDialogueLineMutationOptions } from '@/features/audio/api/create-dialogue-line.mutation';
import { deleteDialogueLineMutationOptions } from '@/features/audio/api/delete-dialogue-line.mutation';
import { updateDialogueLineMutationOptions } from '@/features/audio/api/update-dialogue-line.mutation';
import { sceneDialogueLinesQueryOptions } from '@/features/audio/api/scene-dialogue-lines.query';
import { dialogueLineEditDiff } from '@/features/audio/helpers/dialogue-line-edit-diff';
import { buildDialogueLine } from '../../../fixtures/dialogue-line.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const LINE_ID = dialogueLineIdSchema.parse(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const countingSceneList = (): { calls: () => number } => {
  let calls = 0;
  server.use(
    http.get(API_PATH.sceneDialogueLines(SCENE_ID), () => {
      calls += 1;
      return HttpResponse.json({ items: [buildDialogueLine()] });
    }),
  );

  return { calls: () => calls };
};

describe('createDialogueLineMutationOptions', () => {
  it('posts the line to its scene and re-reads the scene list', async () => {
    const list = countingSceneList();
    let body: unknown;
    server.use(
      http.post(API_PATH.sceneDialogueLines(SCENE_ID), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(buildDialogueLine());
      }),
    );
    const queryClient = buildQueryClient();
    await queryClient.fetchQuery(sceneDialogueLinesQueryOptions(SCENE_ID));

    const created = buildDialogueLine();
    const { id: _id, sceneId: _s, approved: _a, ...request } = created;
    await queryClient
      .getMutationCache()
      .build(
        queryClient,
        createDialogueLineMutationOptions(SCENE_ID, queryClient),
      )
      .execute(request);
    await queryClient.fetchQuery(sceneDialogueLinesQueryOptions(SCENE_ID));

    expect(body).toMatchObject({ text: created.text, pauseAfterMs: 250 });
    expect(list.calls()).toBe(2);
  });
});

describe('updateDialogueLineMutationOptions', () => {
  it('patches only what changed, and re-reads the scene list', async () => {
    const list = countingSceneList();
    let body: unknown;
    server.use(
      http.patch(API_PATH.dialogueLine(LINE_ID), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(buildDialogueLine({ pace: 'urgent' }));
      }),
    );
    const queryClient = buildQueryClient();
    await queryClient.fetchQuery(sceneDialogueLinesQueryOptions(SCENE_ID));

    const original = buildDialogueLine();
    const patch = dialogueLineEditDiff(original, {
      text: original.text,
      emotion: original.emotion,
      pace: 'urgent',
      pauseBeforeMs: original.pauseBeforeMs,
      pauseAfterMs: original.pauseAfterMs,
    });
    await queryClient
      .getMutationCache()
      .build(
        queryClient,
        updateDialogueLineMutationOptions(LINE_ID, SCENE_ID, queryClient),
      )
      .execute(patch);
    await queryClient.fetchQuery(sceneDialogueLinesQueryOptions(SCENE_ID));

    expect(body).toEqual({ pace: 'urgent' });
    expect(list.calls()).toBe(2);
  });

  it('surfaces the approved-line refusal as the typed code the orchestrator raises', async () => {
    server.use(
      http.patch(API_PATH.dialogueLine(LINE_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'DIALOGUE_AUDIO_IMMUTABLE',
            message: 'approved',
          },
          { status: 409 },
        ),
      ),
    );
    const queryClient = buildQueryClient();

    await expect(
      queryClient
        .getMutationCache()
        .build(
          queryClient,
          updateDialogueLineMutationOptions(LINE_ID, SCENE_ID, queryClient),
        )
        .execute({ text: 'changed' }),
    ).rejects.toMatchObject({ kind: 'HTTP', code: 'DIALOGUE_AUDIO_IMMUTABLE' });
  });
});

describe('deleteDialogueLineMutationOptions', () => {
  it('deletes with no body, accepts the 204, and re-reads the scene list', async () => {
    const list = countingSceneList();
    let captured: Request | undefined;
    server.use(
      http.delete(API_PATH.dialogueLine(LINE_ID), ({ request }) => {
        captured = request;
        return new HttpResponse(null, { status: 204 });
      }),
    );
    const queryClient = buildQueryClient();
    await queryClient.fetchQuery(sceneDialogueLinesQueryOptions(SCENE_ID));

    await queryClient
      .getMutationCache()
      .build(
        queryClient,
        deleteDialogueLineMutationOptions(LINE_ID, SCENE_ID, queryClient),
      )
      .execute(undefined);
    await queryClient.fetchQuery(sceneDialogueLinesQueryOptions(SCENE_ID));

    expect(captured?.method).toBe('DELETE');
    expect(list.calls()).toBe(2);
  });
});

describe('dialogueLineEditDiff', () => {
  it('sends nothing for an untouched line, so a no-op save can be refused before it is sent', () => {
    const line = buildDialogueLine();

    expect(
      dialogueLineEditDiff(line, {
        text: line.text,
        emotion: line.emotion,
        pace: line.pace,
        pauseBeforeMs: line.pauseBeforeMs,
        pauseAfterMs: line.pauseAfterMs,
      }),
    ).toEqual({});
  });

  it('keeps a pause set back to zero, because zero is a value and not an absence', () => {
    const line = buildDialogueLine({ pauseAfterMs: 250 });

    expect(
      dialogueLineEditDiff(line, {
        text: line.text,
        emotion: line.emotion,
        pace: line.pace,
        pauseBeforeMs: line.pauseBeforeMs,
        pauseAfterMs: 0,
      }),
    ).toEqual({ pauseAfterMs: 0 });
  });
});
