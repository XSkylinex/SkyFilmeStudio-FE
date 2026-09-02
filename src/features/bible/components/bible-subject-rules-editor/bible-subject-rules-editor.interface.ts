import type { ProjectId } from 'sky-filme-studio-be/contracts';
import type { SubjectRulesValues } from '@/features/bible/interfaces/subject-rules-values';

export interface BibleSubjectRulesEditorProps {
  projectId: ProjectId;
  value: readonly SubjectRulesValues[];
  onChange: (next: readonly SubjectRulesValues[]) => void;
  errorFor: (field: string) => string;
}
