import { render, screen } from '@testing-library/react';
import { AssetsPage } from '@/features/assets/AssetsPage';

describe('AssetsPage', () => {
  it('renders the assets empty state', () => {
    render(<AssetsPage />);

    expect(screen.getByRole('heading', { name: 'Assets' })).toBeInTheDocument();
  });
});
