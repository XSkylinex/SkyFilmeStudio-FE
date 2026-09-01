import { storyboardFrameSchema } from 'sky-filme-studio-be/contracts';
import type { StoryboardFrame } from 'sky-filme-studio-be/contracts';

export const buildStoryboardFrame = (
  overrides: Partial<StoryboardFrame> = {},
): StoryboardFrame =>
  storyboardFrameSchema.parse({
    id: '66666666-6666-4666-8666-666666666666',
    shotId: '55555555-5555-4555-8555-555555555555',
    level: 'KEYFRAME',
    attempt: 1,
    renderAttemptId: '77777777-7777-4777-8777-777777777777',
    artifactId: '88888888-8888-4888-8888-888888888888',
    createdAt: '2026-08-25T00:00:00.000Z',
    ...overrides,
  });
