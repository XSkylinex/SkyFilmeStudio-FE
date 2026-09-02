import type { MusicCue, ProjectId } from 'sky-filme-studio-be/contracts';

export interface MusicCueCardProps {
  readonly projectId: ProjectId;
  readonly cue: MusicCue;
  readonly onRemoved: (name: string) => void;
}
