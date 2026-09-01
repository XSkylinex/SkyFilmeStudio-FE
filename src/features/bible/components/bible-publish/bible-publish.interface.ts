import type { ProjectBible, ProjectId } from 'sky-filme-studio-be/contracts';

export interface BiblePublishProps {
  projectId: ProjectId;
  bible: ProjectBible;
}
