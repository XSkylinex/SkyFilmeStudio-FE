import type { ProjectId } from 'sky-filme-studio-be/contracts';

export interface CreateLocationFormProps {
  readonly projectId: ProjectId;
  readonly onClose: () => void;
}
