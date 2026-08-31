import { projectBibleSchema } from 'sky-filme-studio-be/contracts';
import type { ProjectBible } from 'sky-filme-studio-be/contracts';

export const buildProjectBible = (
  overrides: Partial<ProjectBible> = {},
): ProjectBible =>
  projectBibleSchema.parse({
    id: '77777777-7777-4777-8777-777777777777',
    projectId: 'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
    projectKind: 'STANDALONE',
    version: 1,
    world: {
      contentBoundaries: [],
      recurringThemes: [],
      introOutroRules: [],
      continuityConstraints: [],
    },
    audio: {
      languages: [],
      recurringMotifs: [],
      ambienceRules: [],
    },
    subjectRules: [],
    published: false,
    createdAt: '2026-08-22T00:00:00.000Z',
    updatedAt: '2026-08-22T00:00:00.000Z',
    ...overrides,
  });
