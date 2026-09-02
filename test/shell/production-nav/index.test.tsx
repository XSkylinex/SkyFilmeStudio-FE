import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { ProductionNav } from '@/shell/production-nav';

const CONTINUITY_PATH = '/projects/p/productions/x/continuity';

describe('ProductionNav', () => {
  it('shows no screenplay stage for a MUSIC_DRIVEN production', () => {
    renderInStore(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav
          mode="MUSIC_DRIVEN"
          stageStates={{}}
          continuityPath={CONTINUITY_PATH}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Screenplay')).not.toBeInTheDocument();
    expect(screen.getByText('Music plan')).toBeInTheDocument();
  });

  it('shows a screenplay stage, not a music-plan one, for a SCREENPLAY production', () => {
    renderInStore(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav
          mode="SCREENPLAY"
          stageStates={{}}
          continuityPath={CONTINUITY_PATH}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Screenplay')).toBeInTheDocument();
    expect(screen.queryByText('Music plan')).not.toBeInTheDocument();
  });

  it('marks the stage matching the current location as the current page', () => {
    renderInStore(
      <MemoryRouter initialEntries={['/storyboard']}>
        <ProductionNav
          mode="SCREENPLAY"
          stageStates={{}}
          continuityPath={CONTINUITY_PATH}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(
      'Storyboard',
    );
  });

  it("renders each stage's state as real text through the Badge primitive, not colour alone", () => {
    renderInStore(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav
          mode="SCREENPLAY"
          stageStates={{ screenplay: 'approved', queue: 'blocked' }}
          continuityPath={CONTINUITY_PATH}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('does not mark the Shots stage as current while reviewing one specific shot, which is a different page', () => {
    renderInStore(
      <MemoryRouter initialEntries={['/shots/shot-1']}>
        <ProductionNav
          mode="SCREENPLAY"
          stageStates={{}}
          continuityPath={CONTINUITY_PATH}
        />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole('link', { current: 'page' }),
    ).not.toBeInTheDocument();
  });

  it('renders every stage as a link a keyboard user can reach', () => {
    renderInStore(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav
          mode="SCREENPLAY"
          stageStates={{}}
          continuityPath={CONTINUITY_PATH}
        />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('link')).toHaveLength(7);
  });

  it('offers continuity beside the stages without dressing it as one', () => {
    renderInStore(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav
          mode="SCREENPLAY"
          stageStates={{}}
          continuityPath={CONTINUITY_PATH}
        />
      </MemoryRouter>,
    );

    const continuity = screen.getByRole('link', { name: 'Continuity' });

    expect(continuity).toHaveAttribute('href', CONTINUITY_PATH);
    expect(continuity.querySelector('.badge')).toBeNull();
  });

  it('renders no continuity link when the route carries no production', () => {
    renderInStore(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav
          mode="SCREENPLAY"
          stageStates={{}}
          continuityPath={undefined}
        />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole('link', { name: 'Continuity' }),
    ).not.toBeInTheDocument();
  });
});
