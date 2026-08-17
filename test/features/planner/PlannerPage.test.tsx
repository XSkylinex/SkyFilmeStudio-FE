import { render, screen } from '@testing-library/react';
import { PlannerPage } from '@/features/planner/PlannerPage';

describe('PlannerPage', () => {
  it('renders the plan empty state', () => {
    render(<PlannerPage />);

    expect(screen.getByRole('heading', { name: 'Plan' })).toBeInTheDocument();
  });
});
