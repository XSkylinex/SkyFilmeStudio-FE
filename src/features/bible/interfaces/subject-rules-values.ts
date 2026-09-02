export interface SubjectRelationshipValues {
  readonly subjectId: string;
  readonly description: string;
}

export interface SubjectRulesValues {
  readonly subjectId: string;
  readonly immutableVisualTraits: string;
  readonly allowedVariations: string;
  readonly prohibitedChanges: string;
  readonly scaleRelationships: string;
  readonly wardrobeVariants: string;
  readonly voiceRules: string;
  readonly behaviourAndPersonality: string;
  readonly speaks: boolean;
  readonly relationships: readonly SubjectRelationshipValues[];
}

export type SubjectRulesListField =
  | 'immutableVisualTraits'
  | 'allowedVariations'
  | 'prohibitedChanges'
  | 'scaleRelationships'
  | 'wardrobeVariants'
  | 'voiceRules';
