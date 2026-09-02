import type {
  BibleSubjectRules,
  ProjectId,
} from 'sky-filme-studio-be/contracts';

export interface BibleSubjectRulesProps {
  projectId: ProjectId;
  subjectRules: readonly BibleSubjectRules[];
}
