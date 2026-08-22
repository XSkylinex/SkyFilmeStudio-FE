import type { ProjectId, Prop } from 'sky-filme-studio-be/contracts';

export interface PropCardProps {
  readonly projectId: ProjectId;
  readonly prop: Prop;
}
