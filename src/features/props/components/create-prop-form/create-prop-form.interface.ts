import type { ProjectId } from 'sky-filme-studio-be/contracts';

export interface CreatePropFormProps {
  readonly projectId: ProjectId;
  readonly onClose: () => void;
}
