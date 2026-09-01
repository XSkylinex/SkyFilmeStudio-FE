import type { ProjectId } from 'sky-filme-studio-be/contracts';
import type { BibleFormValues } from '@/features/bible/interfaces/bible-form-values';

export interface CreateBibleFormProps {
  readonly projectId: ProjectId;
  readonly carriesNarrative: boolean;
  readonly initialValues: BibleFormValues;
  readonly prefilledFromVersion?: number | undefined;
  readonly onClose: () => void;
}
