import { render, screen } from '@testing-library/react';
import { ProductionListPage } from '@/features/productions/ProductionListPage';

describe('ProductionListPage', () => {
  it('renders the productions empty state', () => {
    render(<ProductionListPage />);

    expect(
      screen.getByRole('heading', { name: 'Productions', level: 1 }),
    ).toBeInTheDocument();
  });
});
