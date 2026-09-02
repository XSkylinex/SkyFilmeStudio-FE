import type {
  ProjectId,
  PronunciationDictionaryId,
} from 'sky-filme-studio-be/contracts';

export interface DeletePronunciationDictionaryProps {
  readonly projectId: ProjectId;
  readonly dictionaryId: PronunciationDictionaryId;
  readonly language: string;
}
