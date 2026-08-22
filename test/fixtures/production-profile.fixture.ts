import { productionProfileSchema } from 'sky-filme-studio-be/contracts';
import type { ProductionProfile } from 'sky-filme-studio-be/contracts';

export const buildProductionProfile = (
  overrides: Partial<ProductionProfile> = {},
): ProductionProfile =>
  productionProfileSchema.parse({
    id: '44444444-4444-4444-8444-444444444444',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    name: 'Twenty-minute episode',
    targetRuntimeSeconds: 1_200,
    toleranceSeconds: 30,
    fps: 24,
    width: 1_920,
    height: 1_080,
    aspectRatio: '16:9',
    sampleRateHz: 48_000,
    audioChannels: 2,
    sections: [],
    createdAt: '2026-08-22T10:00:00.000Z',
    updatedAt: '2026-08-22T10:00:00.000Z',
    ...overrides,
  });
