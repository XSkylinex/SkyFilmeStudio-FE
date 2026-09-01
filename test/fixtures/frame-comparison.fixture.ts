import { frameComparisonSchema } from 'sky-filme-studio-be/contracts';
import type { FrameComparison } from 'sky-filme-studio-be/contracts';
import { buildStoryboardFrame } from './storyboard-frame.fixture';

export const buildFrameComparison = (
  overrides: Partial<FrameComparison> = {},
): FrameComparison =>
  frameComparisonSchema.parse({
    frame: buildStoryboardFrame(),
    candidateArtifactId: '99999999-9999-4999-8999-999999999999',
    anchors: [
      {
        anchor: {
          id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          frameId: '66666666-6666-4666-8666-666666666666',
          kind: 'SUBJECT',
        },
      },
    ],
    ...overrides,
  });
