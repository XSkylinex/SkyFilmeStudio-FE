import { render, screen } from '@testing-library/react';
import { DashboardPage } from '@/features/dashboard/DashboardPage';

describe('DashboardPage', () => {
  it('renders the dashboard empty state', () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole('heading', { name: 'Dashboard', level: 1 }),
    ).toBeInTheDocument();
  });
});
