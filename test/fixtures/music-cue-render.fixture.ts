import { musicCueRenderSchema } from 'sky-filme-studio-be/contracts';
import type { MusicCueRender } from 'sky-filme-studio-be/contracts';

export const buildMusicCueRender = (
  overrides: Partial<MusicCueRender> = {},
): MusicCueRender =>
  musicCueRenderSchema.parse({
    id: 'cccccccc-8888-4ccc-8ccc-cccccccccccc',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    renderAttemptId: 'dddddddd-8888-4ddd-8ddd-dddddddddddd',
    category: 'MAIN_THEME',
    mood: 'Hopeful, unhurried',
    prompt: 'A warm string figure that does not resolve',
    modelId: 'musicgen-local',
    seed: 4_242,
    generationParametersJson: {},
    path: 'renders/music/candidate-1.wav',
    sha256: '3333333333333333333333333333333333333333333333333333333333333333',
    durationMs: 96_000,
    sampleRate: 48_000,
    channels: 2,
    peakLevelDb: -1.4,
    createdAt: '2026-09-02T16:00:00.000Z',
    ...overrides,
  });
