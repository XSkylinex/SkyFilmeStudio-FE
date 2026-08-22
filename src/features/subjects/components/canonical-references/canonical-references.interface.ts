import type {
  CanonicalAssetSetId,
  ProjectId,
  SubjectId,
} from 'sky-filme-studio-be/contracts';
import type { HeadingLevel } from '@/lib/interfaces/heading-level';

export interface CanonicalReferencesProps {
  projectId: ProjectId;
  subjectId: SubjectId;
  setId: CanonicalAssetSetId;
  headingLevel: HeadingLevel;
}
