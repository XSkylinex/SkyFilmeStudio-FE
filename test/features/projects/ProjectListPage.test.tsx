import { render, screen } from '@testing-library/react';
import { ProjectListPage } from '@/features/projects/ProjectListPage';

describe('ProjectListPage', () => {
  it('renders the projects empty state', () => {
    render(<ProjectListPage />);

    expect(
      screen.getByRole('heading', { name: 'Projects' }),
    ).toBeInTheDocument();
  });
});
