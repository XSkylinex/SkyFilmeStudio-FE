import { continuityFactSchema } from 'sky-filme-studio-be/contracts';
import type { ContinuityFact } from 'sky-filme-studio-be/contracts';

export const buildContinuityFact = (
  overrides: Partial<ContinuityFact> = {},
): ContinuityFact =>
  continuityFactSchema.parse({
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    productionId: '33333333-3333-4333-8333-333333333333',
    entityId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    scopeStartScene: '44444444-4444-4444-8444-444444444444',
    property: 'wardrobe.jacket-condition',
    value: 'torn at the left sleeve',
    sourceEvent: 'Scene 3 — the chase through the market.',
    createdAt: '2026-08-25T00:00:00.000Z',
    updatedAt: '2026-08-25T00:00:00.000Z',
    ...overrides,
  });
