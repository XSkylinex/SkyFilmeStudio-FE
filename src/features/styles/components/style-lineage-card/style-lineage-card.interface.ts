import type { ProjectId, StyleProfileId } from 'sky-filme-studio-be/contracts';

export interface StyleLineageCardProps {
  readonly projectId: ProjectId;
  readonly lineageId: StyleProfileId;
  readonly name: string;
}
