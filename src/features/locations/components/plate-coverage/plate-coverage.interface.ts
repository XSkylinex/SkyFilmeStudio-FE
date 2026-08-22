import type { LocationId, ProjectId } from 'sky-filme-studio-be/contracts';

export interface PlateCoverageProps {
  readonly projectId: ProjectId;
  readonly locationId: LocationId;
}
