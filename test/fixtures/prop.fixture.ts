import { propSchema } from 'sky-filme-studio-be/contracts';
import type { Prop } from 'sky-filme-studio-be/contracts';

export const buildProp = (overrides: Partial<Prop> = {}): Prop =>
  propSchema.parse({
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    name: 'Brass compass',
    canonicalDescription: 'A dented brass compass with a cracked glass face.',
    sourceAssetIds: [],
    referenceImages: [],
    continuityRules: ['the glass stays cracked after scene 4'],
    approved: false,
    ...overrides,
  });
