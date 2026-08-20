import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { SubjectReviewPage } from '@/features/subjects/SubjectReviewPage';

describe('SubjectReviewPage', () => {
  it('renders the subject review empty state', () => {
    renderInStore(<SubjectReviewPage />);

    expect(
      screen.getByRole('heading', { name: 'Subject review', level: 1 }),
    ).toBeInTheDocument();
  });
});
