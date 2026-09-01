import { screen } from '@testing-library/react';
import { PROJECT_KIND } from 'sky-filme-studio-be/contracts';
import { BibleNarrativeSection } from '@/features/bible/components/bible-narrative-section';
import { renderInApp } from '../../../../render-in-app';

describe('BibleNarrativeSection', () => {
  it('states that a music project carries no narrative section, rather than showing nothing', () => {
    renderInApp(
      <BibleNarrativeSection
        narrative={undefined}
        projectKind={PROJECT_KIND.MUSIC}
      />,
    );

    expect(
      screen.getByText(
        'This kind of project carries no narrative section, so these rules cannot be recorded on it at all.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Chronology')).not.toBeInTheDocument();
  });

  it('distinguishes a kind that could carry narrative rules but has none recorded', () => {
    renderInApp(
      <BibleNarrativeSection
        narrative={undefined}
        projectKind={PROJECT_KIND.STANDALONE}
      />,
    );

    expect(
      screen.getByText(
        'This kind of project can carry narrative rules, and none were recorded on this version.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the recorded narrative rules when the kind carries them', () => {
    renderInApp(
      <BibleNarrativeSection
        narrative={{
          worldRules: ['Gravity is ordinary'],
          humourDramaLanguage: 'Dry',
          chronology: 'Linear',
        }}
        projectKind={PROJECT_KIND.SERIES}
      />,
    );

    expect(screen.getByText('Gravity is ordinary')).toBeInTheDocument();
    expect(screen.getByText('Linear')).toBeInTheDocument();
  });
});
