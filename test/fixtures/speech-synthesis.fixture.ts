import { speechSynthesisSchema } from 'sky-filme-studio-be/contracts';
import type { SpeechSynthesis } from 'sky-filme-studio-be/contracts';

export const buildSpeechSynthesis = (
  overrides: Partial<SpeechSynthesis> = {},
): SpeechSynthesis =>
  speechSynthesisSchema.parse({
    id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    dialogueLineId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    pass: 'DRAFT',
    attempt: 1,
    renderAttemptId: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
    voiceProfileId: '99999999-9999-4999-8999-999999999999',
    voiceProfileSha256:
      '0000000000000000000000000000000000000000000000000000000000000000',
    modelId: 'xtts-v2',
    language: 'en',
    text: 'The workshop was never this quiet.',
    spokenText: 'The workshop was never this quiet.',
    pronunciationOverrides: [],
    generationParameters: {},
    audioPath: 'productions/one/speech/line-1-draft-1.wav',
    audioSha256:
      '1111111111111111111111111111111111111111111111111111111111111111',
    durationMs: 2_480,
    sampleRateHz: 48_000,
    peakLevelDb: -3.2,
    createdAt: '2026-09-01T10:00:00.000Z',
    ...overrides,
  });
