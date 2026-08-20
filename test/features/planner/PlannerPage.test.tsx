import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { PlannerPage } from '@/features/planner/PlannerPage';

describe('PlannerPage', () => {
  it('renders the plan empty state', () => {
    renderInStore(<PlannerPage />);

    expect(
      screen.getByRole('heading', { name: 'Plan', level: 1 }),
    ).toBeInTheDocument();
  });
});
