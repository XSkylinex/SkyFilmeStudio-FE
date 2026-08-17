import { render, screen } from '@testing-library/react';
import { ShotsPage } from '@/features/shots/ShotsPage';

describe('ShotsPage', () => {
  it('renders the shots empty state', () => {
    render(<ShotsPage />);

    expect(screen.getByRole('heading', { name: 'Shots' })).toBeInTheDocument();
  });
});
