import type { ShotId } from 'sky-filme-studio-be/contracts';

export interface ShotFramesProps {
  readonly shotId: ShotId;
  readonly shotOrder: number;
}
