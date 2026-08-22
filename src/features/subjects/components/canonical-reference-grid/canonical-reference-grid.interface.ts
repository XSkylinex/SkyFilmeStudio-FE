import type {
  CanonicalReference,
  ProjectId,
} from 'sky-filme-studio-be/contracts';

export interface CanonicalReferenceGridProps {
  projectId: ProjectId;
  references: readonly CanonicalReference[];
}
