import type {
  LocationId,
  LocationPlate,
  ProjectId,
} from 'sky-filme-studio-be/contracts';

export interface PlateFormProps {
  readonly projectId: ProjectId;
  readonly locationId: LocationId;
  readonly plate: LocationPlate | undefined;
  readonly onClose: () => void;
}
