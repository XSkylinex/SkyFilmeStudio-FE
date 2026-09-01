import type { ProjectBible, ProjectId } from 'sky-filme-studio-be/contracts';

export interface EditBibleFormProps {
  readonly projectId: ProjectId;
  readonly bible: ProjectBible;
  readonly onClose: () => void;
}
