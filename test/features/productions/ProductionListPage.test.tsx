import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { ProductionListPage } from '@/features/productions/ProductionListPage';

describe('ProductionListPage', () => {
  it('renders the productions empty state', () => {
    renderInStore(<ProductionListPage />);

    expect(
      screen.getByRole('heading', { name: 'Productions', level: 1 }),
    ).toBeInTheDocument();
  });
});
