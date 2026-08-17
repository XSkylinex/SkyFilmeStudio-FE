import { render, screen } from '@testing-library/react';
import { SubjectsPage } from '@/features/subjects/SubjectsPage';

describe('SubjectsPage', () => {
  it('renders the subjects empty state', () => {
    render(<SubjectsPage />);

    expect(
      screen.getByRole('heading', { name: 'Subjects' }),
    ).toBeInTheDocument();
  });
});
