import { openingEndingAssetSchema } from 'sky-filme-studio-be/contracts';
import type { OpeningEndingAsset } from 'sky-filme-studio-be/contracts';

export const buildOpeningEndingAsset = (
  overrides: Partial<OpeningEndingAsset> = {},
): OpeningEndingAsset =>
  openingEndingAssetSchema.parse({
    id: '99999999-9999-4999-8999-999999999999',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    lineageId: '99999999-9999-4999-8999-999999999999',
    version: 1,
    seasonLabel: 'Season one',
    kind: 'OPENING_VIDEO',
    name: 'Series opening',
    path: 'library/opening-ending/series-opening.mp4',
    mimeType: 'video/mp4',
    sha256: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    width: 1_920,
    height: 1_080,
    fps: 24,
    durationMs: 30_000,
    sampleRate: 48_000,
    channels: 2,
    approved: false,
    ...overrides,
  });
