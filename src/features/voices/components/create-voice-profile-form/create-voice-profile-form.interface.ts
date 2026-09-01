import type { ProjectId } from 'sky-filme-studio-be/contracts';

export interface CreateVoiceProfileFormProps {
  readonly projectId: ProjectId;
  readonly onClose: () => void;
}
