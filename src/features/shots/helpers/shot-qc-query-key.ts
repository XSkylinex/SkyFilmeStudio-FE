import type { ShotId } from 'sky-filme-studio-be/contracts';

export const shotQcQueryKey = (shotId: ShotId): string[] => ['shot-qc', shotId];
