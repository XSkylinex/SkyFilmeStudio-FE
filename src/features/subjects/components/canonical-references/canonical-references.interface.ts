import type {
  CanonicalAssetSetId,
  ProjectId,
  SubjectId,
} from 'sky-filme-studio-be/contracts';

export interface CanonicalReferencesProps {
  projectId: ProjectId;
  subjectId: SubjectId;
  setId: CanonicalAssetSetId;
}
