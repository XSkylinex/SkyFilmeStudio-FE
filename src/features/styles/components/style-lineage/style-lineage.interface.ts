import type { ProjectId } from 'sky-filme-studio-be/contracts';
import type { StyleLineage } from '@/features/styles/interfaces/style-lineage';

export interface StyleLineageProps {
  readonly projectId: ProjectId;
  readonly lineage: StyleLineage;
}
