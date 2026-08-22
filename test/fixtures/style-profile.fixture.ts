import { styleProfileSchema } from 'sky-filme-studio-be/contracts';
import type { StyleProfile } from 'sky-filme-studio-be/contracts';

export const buildStyleProfile = (
  overrides: Partial<StyleProfile> = {},
): StyleProfile =>
  styleProfileSchema.parse({
    id: '11111111-1111-4111-8111-111111111111',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    lineageId: '11111111-1111-4111-8111-111111111111',
    name: 'Nightfall',
    version: 1,
    mode: 'TEST_MODE',
    description: 'Cold key light, long lenses.',
    referenceAssetIds: [],
    paletteRules: ['deep blues'],
    lightingRules: ['single cold key'],
    cameraRules: ['85mm'],
    textureRules: [],
    motionRules: [],
    prohibitedStyleDrift: [],
    imageGenerationDefaults: {},
    videoGenerationDefaults: {},
    approved: false,
    ...overrides,
  });
