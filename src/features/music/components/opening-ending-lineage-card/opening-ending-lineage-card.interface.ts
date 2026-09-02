import type { ProjectId } from 'sky-filme-studio-be/contracts';
import type { OpeningEndingLineage } from '@/features/music/interfaces/opening-ending-lineage';

export interface OpeningEndingLineageCardProps {
  readonly projectId: ProjectId;
  readonly lineage: OpeningEndingLineage;
  readonly onRemoved: (name: string) => void;
}
