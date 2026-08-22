import type { Location, ProjectId } from 'sky-filme-studio-be/contracts';

export interface LocationCardProps {
  readonly projectId: ProjectId;
  readonly location: Location;
}
