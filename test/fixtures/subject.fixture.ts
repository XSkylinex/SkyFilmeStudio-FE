import { subjectSchema } from 'sky-filme-studio-be/contracts';
import type { Subject } from 'sky-filme-studio-be/contracts';

export const buildSubject = (overrides: Partial<Subject> = {}): Subject =>
  subjectSchema.parse({
    id: '66666666-6666-4666-8666-666666666666',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    displayName: 'Mira',
    subjectType: 'HUMAN',
    sourceMode: 'CAPTURED',
    narrativeRole: 'CHARACTER',
    canonicalDescription: 'A woman in her thirties with short dark hair.',
    immutableTraits: ['short dark hair', 'brown eyes'],
    mutableTraits: ['expression'],
    prohibitedChanges: ['hair colour'],
    colorPalette: ['#2b2118', '#7a5c3e'],
    wardrobeOrSurfaceRules: ['always wears a green jacket'],
    active: true,
    createdAt: '2026-08-16T10:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
    ...overrides,
  });
