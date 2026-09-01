import type { Location, ProjectId } from 'sky-filme-studio-be/contracts';

export interface EditLocationFormProps {
  readonly projectId: ProjectId;
  readonly location: Location;
  readonly onClose: () => void;
}
