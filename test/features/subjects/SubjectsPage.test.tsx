import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { SubjectsPage } from '@/features/subjects/SubjectsPage';

describe('SubjectsPage', () => {
  it('renders the subjects empty state', () => {
    renderInStore(<SubjectsPage />);

    expect(
      screen.getByRole('heading', { name: 'Subjects', level: 1 }),
    ).toBeInTheDocument();
  });
});
