import type { ShotId } from 'sky-filme-studio-be/contracts';

export const shotStoryboardQueryKey = (shotId: ShotId): string[] => [
  'shot-storyboard',
  shotId,
];
