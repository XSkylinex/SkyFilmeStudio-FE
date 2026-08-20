import { render, screen } from '@testing-library/react';
import { StylesPage } from '@/features/styles/StylesPage';

describe('StylesPage', () => {
  it('renders the styles empty state', () => {
    render(<StylesPage />);

    expect(
      screen.getByRole('heading', { name: 'Styles', level: 1 }),
    ).toBeInTheDocument();
  });
});
