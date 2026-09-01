import { sceneSchema } from 'sky-filme-studio-be/contracts';
import type { Scene } from 'sky-filme-studio-be/contracts';

export const buildScene = (overrides: Partial<Scene> = {}): Scene =>
  sceneSchema.parse({
    id: '44444444-4444-4444-8444-444444444444',
    productionId: '33333333-3333-4333-8333-333333333333',
    order: 0,
    purpose: 'Introduce the protagonist in her workshop.',
    targetDurationSeconds: 90,
    subjectIds: [],
    propIds: [],
    continuityIn: 'Morning light, workshop untouched.',
    continuityOut: 'She leaves the workshop for the street.',
    ...overrides,
  });
