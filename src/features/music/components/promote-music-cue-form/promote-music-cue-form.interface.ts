import type { MusicCueRender, ProjectId } from 'sky-filme-studio-be/contracts';

export interface PromoteMusicCueFormProps {
  readonly projectId: ProjectId;
  readonly render: MusicCueRender;
  readonly onClose: () => void;
}
