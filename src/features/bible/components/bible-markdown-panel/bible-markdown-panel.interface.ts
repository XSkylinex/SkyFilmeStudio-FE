import type {
  ProjectBibleVersionId,
  ProjectId,
} from 'sky-filme-studio-be/contracts';

export interface BibleMarkdownPanelProps {
  projectId: ProjectId;
  bibleId: ProjectBibleVersionId;
}
