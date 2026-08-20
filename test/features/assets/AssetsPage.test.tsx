import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { AssetsPage } from '@/features/assets/AssetsPage';

describe('AssetsPage', () => {
  it('renders the assets empty state', () => {
    renderInStore(<AssetsPage />);

    expect(
      screen.getByRole('heading', { name: 'Assets', level: 1 }),
    ).toBeInTheDocument();
  });
});
