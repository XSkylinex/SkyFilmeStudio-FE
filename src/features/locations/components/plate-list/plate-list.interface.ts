import type { LocationId, ProjectId } from 'sky-filme-studio-be/contracts';

export interface PlateListProps {
  readonly projectId: ProjectId;
  readonly locationId: LocationId;
}
