import { shotKeyframeStatusSchema } from 'sky-filme-studio-be/contracts';
import type { ShotKeyframeStatus } from 'sky-filme-studio-be/contracts';

export const buildShotKeyframeStatus = (
  overrides: Partial<ShotKeyframeStatus> = {},
): ShotKeyframeStatus =>
  shotKeyframeStatusSchema.parse({
    shotId: '55555555-5555-4555-8555-555555555555',
    keyframeRequirement: 'REQUIRED_BY_SUBJECT',
    videoPermitted: false,
    detail: 'A server-authored sentence about why video is not yet permitted.',
    ...overrides,
  });
