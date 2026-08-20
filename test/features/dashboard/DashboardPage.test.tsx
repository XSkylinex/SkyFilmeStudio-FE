import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { DashboardPage } from '@/features/dashboard/DashboardPage';

describe('DashboardPage', () => {
  it('renders the dashboard empty state', () => {
    renderInStore(<DashboardPage />);

    expect(
      screen.getByRole('heading', { name: 'Dashboard', level: 1 }),
    ).toBeInTheDocument();
  });
});
