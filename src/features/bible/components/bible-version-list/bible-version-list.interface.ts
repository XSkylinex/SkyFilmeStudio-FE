import type {
  ProjectBible,
  ProjectBibleVersionId,
} from 'sky-filme-studio-be/contracts';

export interface BibleVersionListProps {
  versions: readonly ProjectBible[];
  activeId: ProjectBibleVersionId | undefined;
  selectedId: ProjectBibleVersionId;
  onSelect: (id: ProjectBibleVersionId) => void;
}
