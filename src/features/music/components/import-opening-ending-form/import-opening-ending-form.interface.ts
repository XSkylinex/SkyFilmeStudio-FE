import type { ProjectId } from 'sky-filme-studio-be/contracts';
import type { OpeningEndingLineage } from '@/features/music/interfaces/opening-ending-lineage';

export interface ImportOpeningEndingFormProps {
  readonly projectId: ProjectId;
  readonly lineages: readonly OpeningEndingLineage[];
  readonly onClose: () => void;
}
