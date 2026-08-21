import { projectSchema } from 'sky-filme-studio-be/contracts';
import type { Project } from 'sky-filme-studio-be/contracts';

export const buildProject = (overrides: Partial<Project> = {}): Project =>
  projectSchema.parse({
    id: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    title: 'A Quiet Harbour',
    description: 'A ten-minute documentary cut from a phone photo set.',
    projectKind: 'STANDALONE',
    primaryLanguage: 'en',
    additionalLanguages: [],
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
    ...overrides,
  });
