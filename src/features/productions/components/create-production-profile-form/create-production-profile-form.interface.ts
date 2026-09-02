import type { ProjectId } from 'sky-filme-studio-be/contracts';

export interface CreateProductionProfileFormProps {
  readonly projectId: ProjectId;
  readonly onClose: () => void;
}
