import type {
  BibleSubjectRules,
  ProjectId,
} from 'sky-filme-studio-be/contracts';
import type { BibleFormValues } from '@/features/bible/interfaces/bible-form-values';

export interface CreateBibleFormProps {
  readonly projectId: ProjectId;
  readonly carriesNarrative: boolean;
  readonly initialValues: BibleFormValues;
  readonly carriedSubjectRules?: readonly BibleSubjectRules[] | undefined;
  readonly prefilledFromVersion?: number | undefined;
  readonly onClose: () => void;
}
