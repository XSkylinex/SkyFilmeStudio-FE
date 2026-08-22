import { canonicalAssetSetSchema } from 'sky-filme-studio-be/contracts';
import type { CanonicalAssetSet } from 'sky-filme-studio-be/contracts';

export const buildCanonicalAssetSet = (
  overrides: Partial<CanonicalAssetSet> = {},
): CanonicalAssetSet =>
  canonicalAssetSetSchema.parse({
    id: '77777777-7777-4777-8777-777777777777',
    subjectId: '66666666-6666-4666-8666-666666666666',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    approvalState: 'APPROVED',
    notes: 'Front, rear and three-quarter turnaround.',
    frozenTraits: ['short dark hair', 'brown eyes'],
    createdAt: '2026-08-16T10:00:00.000Z',
    updatedAt: '2026-08-16T10:05:00.000Z',
    ...overrides,
  });
