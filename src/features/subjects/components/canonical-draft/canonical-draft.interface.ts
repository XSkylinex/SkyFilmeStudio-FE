import type { ProjectId, SubjectId } from 'sky-filme-studio-be/contracts';

export interface CanonicalDraftProps {
  projectId: ProjectId;
  subjectId: SubjectId;
  subjectName: string;
}
