import {
  productionMixSchema,
  sceneMixSchema,
} from 'sky-filme-studio-be/contracts';
import type { ProductionMix, SceneMix } from 'sky-filme-studio-be/contracts';

export const buildSceneMix = (overrides: Partial<SceneMix> = {}): SceneMix =>
  sceneMixSchema.parse({
    id: 'aaaaaaaa-1111-4aaa-8aaa-aaaaaaaaaaaa',
    sceneId: '44444444-4444-4444-8444-444444444444',
    renderAttemptId: 'bbbbbbbb-1111-4bbb-8bbb-bbbbbbbbbbbb',
    dxStemId: 'cccccccc-1111-4ccc-8ccc-cccccccccccc',
    mxStemId: 'cccccccc-2222-4ccc-8ccc-cccccccccccc',
    fxStemId: 'cccccccc-3333-4ccc-8ccc-cccccccccccc',
    ambStemId: 'cccccccc-4444-4ccc-8ccc-cccccccccccc',
    path: 'productions/p1/mixes/scene-1.wav',
    sha256: '1111111111111111111111111111111111111111111111111111111111111111',
    durationMs: 42_000,
    sampleRate: 48_000,
    channels: 2,
    createdAt: '2026-09-02T12:00:00.000Z',
    ...overrides,
  });

export const buildProductionMix = (
  overrides: Partial<ProductionMix> = {},
): ProductionMix =>
  productionMixSchema.parse({
    id: 'dddddddd-1111-4ddd-8ddd-dddddddddddd',
    productionId: '33333333-3333-4333-8333-333333333333',
    renderAttemptId: 'bbbbbbbb-2222-4bbb-8bbb-bbbbbbbbbbbb',
    path: 'productions/p1/mixes/production.wav',
    sha256: '2222222222222222222222222222222222222222222222222222222222222222',
    durationMs: 1_200_000,
    sampleRate: 48_000,
    channels: 2,
    inputIntegratedLufs: -21.4,
    inputTruePeakDbtp: -0.8,
    outputIntegratedLufs: -16,
    outputTruePeakDbtp: -1.2,
    targetLufs: -16,
    targetTruePeakDbtp: -1,
    targetLoudnessRange: 7,
    createdAt: '2026-09-02T12:30:00.000Z',
    ...overrides,
  });
