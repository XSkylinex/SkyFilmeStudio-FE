import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { StylesPage } from '@/features/styles/StylesPage';

describe('StylesPage', () => {
  it('renders the styles empty state', () => {
    renderInStore(<StylesPage />);

    expect(
      screen.getByRole('heading', { name: 'Styles', level: 1 }),
    ).toBeInTheDocument();
  });
});
