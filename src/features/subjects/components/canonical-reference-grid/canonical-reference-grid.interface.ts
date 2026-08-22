import type { HeadingLevel } from '@/lib/interfaces/heading-level';
import type {
  CanonicalReference,
  ProjectId,
} from 'sky-filme-studio-be/contracts';

export interface CanonicalReferenceGridProps {
  headingLevel: HeadingLevel;
  projectId: ProjectId;
  references: readonly CanonicalReference[];
}
