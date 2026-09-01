import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { sceneIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  sceneDialogueLinesQueryKey,
  sceneDialogueLinesQueryOptions,
} from '@/features/audio/api/scene-dialogue-lines.query';
import { SCENE_DIALOGUE_LINES_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildDialogueLine } from '../../../fixtures/dialogue-line.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('sceneDialogueLinesQueryKey', () => {
  it('keys by scene, so two scenes never share a cached list', () => {
    const other = sceneIdSchema.parse('99999999-9999-4999-8999-999999999999');

    expect(sceneDialogueLinesQueryKey(SCENE_ID)).toEqual([
      'scene-dialogue-lines',
      SCENE_ID,
    ]);
    expect(sceneDialogueLinesQueryKey(SCENE_ID)).not.toEqual(
      sceneDialogueLinesQueryKey(other),
    );
  });
});

describe('sceneDialogueLinesQueryOptions', () => {
  it('uses SCENE_DIALOGUE_LINES_STALE_TIME_MS as its staleTime', () => {
    expect(sceneDialogueLinesQueryOptions(SCENE_ID).staleTime).toBe(
      SCENE_DIALOGUE_LINES_STALE_TIME_MS,
    );
  });

  it('parses the page envelope this collection actually sends', async () => {
    const page = { items: [buildDialogueLine()], nextCursor: undefined };
    server.use(
      http.get(API_PATH.sceneDialogueLines(SCENE_ID), () =>
        HttpResponse.json(page),
      ),
    );

    const result = await queryClientWithoutRetry().fetchQuery(
      sceneDialogueLinesQueryOptions(SCENE_ID),
    );

    expect(result.items).toHaveLength(1);
    expect(result.nextCursor).toBeUndefined();
  });

  it('keeps nextCursor, so a truncated first page is detectable rather than silent', async () => {
    server.use(
      http.get(API_PATH.sceneDialogueLines(SCENE_ID), () =>
        HttpResponse.json({
          items: [buildDialogueLine()],
          nextCursor: 'next-page-cursor',
        }),
      ),
    );

    const result = await queryClientWithoutRetry().fetchQuery(
      sceneDialogueLinesQueryOptions(SCENE_ID),
    );

    expect(result.nextCursor).toBe('next-page-cursor');
  });

  it('refuses a payload whose line carries no voice profile', async () => {
    const line = buildDialogueLine();
    const { voiceProfileId: _omitted, ...withoutVoice } = line;
    server.use(
      http.get(API_PATH.sceneDialogueLines(SCENE_ID), () =>
        HttpResponse.json({ items: [withoutVoice] }),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        sceneDialogueLinesQueryOptions(SCENE_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
