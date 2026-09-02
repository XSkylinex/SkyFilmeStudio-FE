import { sfxAssetSchema } from 'sky-filme-studio-be/contracts';
import type { SfxAsset } from 'sky-filme-studio-be/contracts';

export const buildSfxAsset = (overrides: Partial<SfxAsset> = {}): SfxAsset =>
  sfxAssetSchema.parse({
    id: '77777777-7777-4777-8777-777777777777',
    category: 'FOOTSTEPS',
    name: 'Boots on gravel',
    tags: ['exterior', 'walking'],
    path: 'library/sfx/boots-on-gravel.wav',
    mimeType: 'audio/wav',
    sha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    durationMs: 2_400,
    sampleRate: 48_000,
    channels: 2,
    origin: 'IMPORTED',
    licence: 'CC0',
    provenanceJson: {},
    approved: false,
    ...overrides,
  });
