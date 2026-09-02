import { subjectIdSchema } from 'sky-filme-studio-be/contracts';
import type { BibleSubjectRules } from 'sky-filme-studio-be/contracts';
import { subjectRulesFromValues } from '@/features/bible/helpers/subject-rules-from-values';
import {
  EMPTY_SUBJECT_RULES_VALUES,
  subjectRulesValuesFrom,
} from '@/features/bible/helpers/subject-rules-values';

const MIRA_ID = subjectIdSchema.parse('11111111-1111-4111-8111-111111111111');
const TOVA_ID = subjectIdSchema.parse('22222222-2222-4222-8222-222222222222');

const recorded: BibleSubjectRules = {
  subjectId: MIRA_ID,
  immutableVisualTraits: ['Short dark hair', 'A chipped left horn'],
  allowedVariations: ['Expression'],
  prohibitedChanges: [],
  scaleRelationships: [],
  wardrobeVariants: ['A green jacket'],
  behaviourAndPersonality: 'Wary of strangers',
  speaks: true,
  voiceRules: ['Never shouts'],
  relationships: [{ subjectId: TOVA_ID, description: 'Older sister' }],
};

describe('subjectRulesValuesFrom', () => {
  it('puts one rule per line in a box, so a list edits as text', () => {
    const [values] = subjectRulesValuesFrom([recorded]);

    expect(values?.immutableVisualTraits).toBe(
      'Short dark hair\nA chipped left horn',
    );
    expect(values?.behaviourAndPersonality).toBe('Wary of strangers');
    expect(values?.relationships).toEqual([
      { subjectId: TOVA_ID, description: 'Older sister' },
    ]);
  });

  it('shows an absent behaviour note as an empty box rather than the word undefined', () => {
    const { behaviourAndPersonality: _omitted, ...withoutBehaviour } = recorded;

    expect(
      subjectRulesValuesFrom([withoutBehaviour])[0]?.behaviourAndPersonality,
    ).toBe('');
  });
});

describe('subjectRulesFromValues', () => {
  it('sends what was recorded back unchanged, so an untouched block is not an edit', () => {
    expect(subjectRulesFromValues(subjectRulesValuesFrom([recorded]))).toEqual([
      recorded,
    ]);
  });

  it('splits a box on newlines and drops blank lines and surrounding space', () => {
    const [sent] = subjectRulesFromValues([
      {
        ...EMPTY_SUBJECT_RULES_VALUES,
        subjectId: MIRA_ID,
        immutableVisualTraits:
          '  Short dark hair  \n\n  A chipped left horn  \n',
      },
    ]);

    expect(sent?.immutableVisualTraits).toEqual([
      'Short dark hair',
      'A chipped left horn',
    ]);
  });

  it('omits a blank behaviour note instead of sending an empty string the contract refuses', () => {
    const [sent] = subjectRulesFromValues([
      {
        ...EMPTY_SUBJECT_RULES_VALUES,
        subjectId: MIRA_ID,
        behaviourAndPersonality: '   ',
      },
    ]);

    expect(sent).not.toHaveProperty('behaviourAndPersonality');
  });

  it('trims a relationship description but never invents one', () => {
    const [sent] = subjectRulesFromValues([
      {
        ...EMPTY_SUBJECT_RULES_VALUES,
        subjectId: MIRA_ID,
        relationships: [{ subjectId: TOVA_ID, description: '  Older sister ' }],
      },
    ]);

    expect(sent?.relationships).toEqual([
      { subjectId: TOVA_ID, description: 'Older sister' },
    ]);
  });
});
