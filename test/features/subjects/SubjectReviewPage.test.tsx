import { render, screen } from '@testing-library/react';
import { SubjectReviewPage } from '@/features/subjects/SubjectReviewPage';

describe('SubjectReviewPage', () => {
  it('renders the subject review empty state', () => {
    render(<SubjectReviewPage />);

    expect(
      screen.getByRole('heading', { name: 'Subject review', level: 1 }),
    ).toBeInTheDocument();
  });
});
