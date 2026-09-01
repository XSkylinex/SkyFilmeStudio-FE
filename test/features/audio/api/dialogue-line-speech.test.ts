import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  dialogueLineIdSchema,
  speechSynthesisIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  dialogueLineSpeechQueryKey,
  dialogueLineSpeechQueryOptions,
} from '@/features/audio/api/dialogue-line-speech.query';
import { dialogueLineQueryKey } from '@/features/audio/helpers/dialogue-line-query-key';
import { DIALOGUE_LINE_SPEECH_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildSpeechSynthesis } from '../../../fixtures/speech-synthesis.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const LINE_ID = dialogueLineIdSchema.parse(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('dialogueLineSpeechQueryKey', () => {
  it('extends the line key, so invalidating the line reaches its takes', () => {
    expect(dialogueLineSpeechQueryKey(LINE_ID).slice(0, 2)).toEqual(
      dialogueLineQueryKey(LINE_ID),
    );
    expect(dialogueLineSpeechQueryKey(LINE_ID)).toEqual([
      'dialogue-line',
      LINE_ID,
      'speech',
    ]);
  });
});

describe('dialogueLineSpeechQueryOptions', () => {
  it('uses DIALOGUE_LINE_SPEECH_STALE_TIME_MS as its staleTime', () => {
    expect(dialogueLineSpeechQueryOptions(LINE_ID).staleTime).toBe(
      DIALOGUE_LINE_SPEECH_STALE_TIME_MS,
    );
  });

  it('parses the bare array of takes, keeping both passes and their attempts', async () => {
    const takes = [
      buildSpeechSynthesis({ pass: 'DRAFT', attempt: 1 }),
      buildSpeechSynthesis({
        id: speechSynthesisIdSchema.parse(
          'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        ),
        pass: 'FINAL',
        attempt: 1,
      }),
    ];
    server.use(
      http.get(API_PATH.dialogueLineSpeech(LINE_ID), () =>
        HttpResponse.json(takes),
      ),
    );

    const result = await queryClientWithoutRetry().fetchQuery(
      dialogueLineSpeechQueryOptions(LINE_ID),
    );

    expect(result.map((take) => take.pass)).toEqual(['DRAFT', 'FINAL']);
  });

  it('refuses a pass the contract does not define', async () => {
    server.use(
      http.get(API_PATH.dialogueLineSpeech(LINE_ID), () =>
        HttpResponse.json([{ ...buildSpeechSynthesis(), pass: 'PREVIEW' }]),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        dialogueLineSpeechQueryOptions(LINE_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
