import type { Production, ProjectId } from 'sky-filme-studio-be/contracts';

export interface EditProductionFormProps {
  readonly projectId: ProjectId;
  readonly production: Production;
  readonly onClose: () => void;
}
