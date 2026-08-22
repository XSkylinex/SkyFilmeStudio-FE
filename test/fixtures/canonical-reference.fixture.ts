import { canonicalReferenceSchema } from 'sky-filme-studio-be/contracts';
import type { CanonicalReference } from 'sky-filme-studio-be/contracts';

export const buildCanonicalReference = (
  overrides: Partial<CanonicalReference> = {},
): CanonicalReference =>
  canonicalReferenceSchema.parse({
    id: '88888888-8888-4888-8888-888888888888',
    canonicalAssetSetId: '77777777-7777-4777-8777-777777777777',
    subjectId: '66666666-6666-4666-8666-666666666666',
    role: 'FRONT_VIEW',
    ordinal: 0,
    sourceAssetId: '11111111-1111-4111-8111-111111111111',
    approved: true,
    anchorEligible: true,
    createdAt: '2026-08-16T10:02:00.000Z',
    ...overrides,
  });
