import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProductionNav } from '@/shell/production-nav';

describe('ProductionNav', () => {
  it('shows no screenplay stage for a MUSIC_DRIVEN production', () => {
    render(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav mode="MUSIC_DRIVEN" stageStates={{}} />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Screenplay')).not.toBeInTheDocument();
    expect(screen.getByText('Music plan')).toBeInTheDocument();
  });

  it('shows a screenplay stage, not a music-plan one, for a SCREENPLAY production', () => {
    render(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav mode="SCREENPLAY" stageStates={{}} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Screenplay')).toBeInTheDocument();
    expect(screen.queryByText('Music plan')).not.toBeInTheDocument();
  });

  it('marks the stage matching the current location as the current page', () => {
    render(
      <MemoryRouter initialEntries={['/storyboard']}>
        <ProductionNav mode="SCREENPLAY" stageStates={{}} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(
      'Storyboard',
    );
  });

  it("renders each stage's state as real text through the Badge primitive, not colour alone", () => {
    render(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav
          mode="SCREENPLAY"
          stageStates={{ screenplay: 'approved', queue: 'blocked' }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('does not mark the Shots stage as current while reviewing one specific shot, which is a different page', () => {
    render(
      <MemoryRouter initialEntries={['/shots/shot-1']}>
        <ProductionNav mode="SCREENPLAY" stageStates={{}} />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole('link', { current: 'page' }),
    ).not.toBeInTheDocument();
  });

  it('renders every stage as a link a keyboard user can reach', () => {
    render(
      <MemoryRouter initialEntries={['/plan']}>
        <ProductionNav mode="SCREENPLAY" stageStates={{}} />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('link')).toHaveLength(6);
  });
});
