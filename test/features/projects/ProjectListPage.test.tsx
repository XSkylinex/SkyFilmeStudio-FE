import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { ProjectListPage } from '@/features/projects/ProjectListPage';

describe('ProjectListPage', () => {
  it('renders the projects empty state', () => {
    renderInStore(<ProjectListPage />);

    expect(
      screen.getByRole('heading', { name: 'Projects', level: 1 }),
    ).toBeInTheDocument();
  });
});
