import type {
  ProjectId,
  PronunciationDictionaryId,
} from 'sky-filme-studio-be/contracts';

export interface PronunciationEntriesProps {
  readonly projectId: ProjectId;
  readonly dictionaryId: PronunciationDictionaryId;
  readonly language: string;
}
