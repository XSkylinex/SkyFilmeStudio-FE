import type {
  BibleSubjectRules,
  ProjectBible,
} from 'sky-filme-studio-be/contracts';
import type { SubjectRulesValues } from '@/features/bible/interfaces/subject-rules-values';

export const EMPTY_SUBJECT_RULES_VALUES: SubjectRulesValues = {
  subjectId: '',
  immutableVisualTraits: '',
  allowedVariations: '',
  prohibitedChanges: '',
  scaleRelationships: '',
  wardrobeVariants: '',
  voiceRules: '',
  behaviourAndPersonality: '',
  speaks: false,
  relationships: [],
};

const joined = (lines: readonly string[]): string => lines.join('\n');

export const subjectRulesValuesFrom = (
  rules: ProjectBible['subjectRules'] | readonly BibleSubjectRules[],
): SubjectRulesValues[] =>
  rules.map((entry) => ({
    subjectId: entry.subjectId,
    immutableVisualTraits: joined(entry.immutableVisualTraits),
    allowedVariations: joined(entry.allowedVariations),
    prohibitedChanges: joined(entry.prohibitedChanges),
    scaleRelationships: joined(entry.scaleRelationships),
    wardrobeVariants: joined(entry.wardrobeVariants),
    voiceRules: joined(entry.voiceRules),
    behaviourAndPersonality: entry.behaviourAndPersonality ?? '',
    speaks: entry.speaks,
    relationships: entry.relationships.map((relationship) => ({
      subjectId: relationship.subjectId,
      description: relationship.description,
    })),
  }));
