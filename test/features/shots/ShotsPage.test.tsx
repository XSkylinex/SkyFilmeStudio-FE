import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { ShotsPage } from '@/features/shots/ShotsPage';

describe('ShotsPage', () => {
  it('renders the shots empty state', () => {
    renderInStore(<ShotsPage />);

    expect(
      screen.getByRole('heading', { name: 'Shots', level: 1 }),
    ).toBeInTheDocument();
  });
});
