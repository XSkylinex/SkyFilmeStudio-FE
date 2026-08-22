import type { ProjectId } from 'sky-filme-studio-be/contracts';

export interface CreateProductionFormProps {
  projectId: ProjectId;
  onClose: () => void;
}
