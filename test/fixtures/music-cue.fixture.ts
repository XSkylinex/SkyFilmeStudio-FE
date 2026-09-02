import { musicCueSchema } from 'sky-filme-studio-be/contracts';
import type { MusicCue } from 'sky-filme-studio-be/contracts';

export const buildMusicCue = (overrides: Partial<MusicCue> = {}): MusicCue =>
  musicCueSchema.parse({
    id: '88888888-8888-4888-8888-888888888888',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    category: 'MAIN_THEME',
    name: 'Opening theme',
    tags: ['strings', 'warm'],
    path: 'library/music/opening-theme.wav',
    mimeType: 'audio/wav',
    sha256: 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
    durationMs: 96_000,
    sampleRate: 48_000,
    channels: 2,
    bpm: 92,
    musicalKey: 'D minor',
    mood: 'Hopeful, unhurried',
    loopable: true,
    introMs: 4_000,
    outroMs: 6_000,
    safeDialogueLevelDb: -18,
    origin: 'LOCALLY_GENERATED',
    provenanceJson: {},
    approved: false,
    ...overrides,
  });
