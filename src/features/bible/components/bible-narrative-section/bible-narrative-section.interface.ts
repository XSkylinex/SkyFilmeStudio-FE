import type {
  BibleNarrativeRules,
  ProjectKind,
} from 'sky-filme-studio-be/contracts';

export interface BibleNarrativeSectionProps {
  narrative: BibleNarrativeRules | undefined;
  projectKind: ProjectKind;
}
