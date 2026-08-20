import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { ShotReviewPage } from '@/features/shots/ShotReviewPage';

describe('ShotReviewPage', () => {
  it('renders the shot review empty state', () => {
    renderInStore(<ShotReviewPage />);

    expect(
      screen.getByRole('heading', { name: 'Shot review', level: 1 }),
    ).toBeInTheDocument();
  });
});
