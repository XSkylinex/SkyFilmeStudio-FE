import { dialogueLineSchema } from 'sky-filme-studio-be/contracts';
import type { DialogueLine } from 'sky-filme-studio-be/contracts';

export const buildDialogueLine = (
  overrides: Partial<DialogueLine> = {},
): DialogueLine =>
  dialogueLineSchema.parse({
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    sceneId: '44444444-4444-4444-8444-444444444444',
    voiceProfileId: '99999999-9999-4999-8999-999999999999',
    order: 0,
    language: 'en',
    text: 'The workshop was never this quiet.',
    pronunciationOverrides: [],
    emotion: 'wistful',
    pace: 'measured',
    pauseBeforeMs: 0,
    pauseAfterMs: 250,
    approved: false,
    ...overrides,
  });
