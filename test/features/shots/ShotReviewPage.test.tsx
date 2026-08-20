import { render, screen } from '@testing-library/react';
import { ShotReviewPage } from '@/features/shots/ShotReviewPage';

describe('ShotReviewPage', () => {
  it('renders the shot review empty state', () => {
    render(<ShotReviewPage />);

    expect(
      screen.getByRole('heading', { name: 'Shot review', level: 1 }),
    ).toBeInTheDocument();
  });
});
