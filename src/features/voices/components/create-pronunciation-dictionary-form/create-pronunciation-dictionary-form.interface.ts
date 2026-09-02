import type { ProjectId } from 'sky-filme-studio-be/contracts';

export interface CreatePronunciationDictionaryFormProps {
  readonly projectId: ProjectId;
  readonly onClose: () => void;
}
