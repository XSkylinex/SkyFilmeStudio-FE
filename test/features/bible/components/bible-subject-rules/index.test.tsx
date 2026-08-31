import { screen } from '@testing-library/react';
import { subjectIdSchema } from 'sky-filme-studio-be/contracts';
import type { BibleSubjectRules } from 'sky-filme-studio-be/contracts';
import { BibleSubjectRulesSection } from '@/features/bible/components/bible-subject-rules';
import { renderInApp } from '../../../../render-in-app';

const buildRules = (
  overrides: Partial<BibleSubjectRules> = {},
): BibleSubjectRules => ({
  subjectId: subjectIdSchema.parse('11111111-1111-4111-8111-111111111111'),
  immutableVisualTraits: [],
  allowedVariations: [],
  prohibitedChanges: [],
  scaleRelationships: [],
  wardrobeVariants: [],
  speaks: true,
  voiceRules: [],
  relationships: [],
  ...overrides,
});

describe('BibleSubjectRulesSection', () => {
  it('says voice rules cannot apply to a subject that does not speak', () => {
    renderInApp(
      <BibleSubjectRulesSection
        subjectRules={[buildRules({ speaks: false })]}
      />,
    );

    expect(
      screen.getByText(
        'This subject does not speak, so voice rules cannot apply to it.',
      ),
    ).toBeInTheDocument();
  });

  it('shows a speaking subject its voice rules instead', () => {
    renderInApp(
      <BibleSubjectRulesSection
        subjectRules={[
          buildRules({ speaks: true, voiceRules: ['Never shouts'] }),
        ]}
      />,
    );

    expect(screen.getByText('Never shouts')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'This subject does not speak, so voice rules cannot apply to it.',
      ),
    ).not.toBeInTheDocument();
  });

  it('says so when no subject carries rules at all', () => {
    renderInApp(<BibleSubjectRulesSection subjectRules={[]} />);

    expect(
      screen.getByText('No subject carries rules on this version.'),
    ).toBeInTheDocument();
  });
});
