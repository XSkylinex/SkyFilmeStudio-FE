import { screen } from '@testing-library/react';
import { StyleVersionDiff } from '@/features/styles/components/style-version-diff';
import { buildStyleProfile } from '../../../../fixtures/style-profile.fixture';
import { renderInApp } from '../../../../render-in-app';

describe('StyleVersionDiff', () => {
  it('names the field that changed and marks each line as removed or added in words, not only by colour', () => {
    renderInApp(
      <StyleVersionDiff
        previous={buildStyleProfile({
          version: 1,
          paletteRules: ['deep blues', 'no red'],
        })}
        current={buildStyleProfile({
          version: 2,
          paletteRules: ['deep blues', 'amber'],
        })}
      />,
    );

    expect(screen.getByText('What changed from v1')).toBeInTheDocument();
    expect(screen.getByText('Palette rules')).toBeInTheDocument();
    expect(screen.getByText('no red').closest('li')).toHaveTextContent(
      /removed/,
    );
    expect(screen.getByText('amber').closest('li')).toHaveTextContent(/added/);
    expect(screen.queryByText('deep blues')).not.toBeInTheDocument();
    expect(screen.queryByText('Camera rules')).not.toBeInTheDocument();
  });

  it('says so when the next version changed nothing, rather than showing an empty list', () => {
    renderInApp(
      <StyleVersionDiff
        previous={buildStyleProfile({ version: 3 })}
        current={buildStyleProfile({ version: 4, approved: true })}
      />,
    );

    expect(screen.getByText('No differences from v3.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('reads a Hebrew rule in its own direction inside the English list', () => {
    renderInApp(
      <StyleVersionDiff
        previous={buildStyleProfile({ lightingRules: [] })}
        current={buildStyleProfile({ lightingRules: ['אור קר יחיד'] })}
      />,
    );

    const line = screen.getByText('אור קר יחיד');

    expect(line.tagName).toBe('BDI');
    expect(line).toHaveAttribute('dir', 'auto');
  });
});
