import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { LocationsPage } from '@/features/locations/LocationsPage';

describe('LocationsPage', () => {
  it('renders the locations empty state', () => {
    renderInStore(<LocationsPage />);

    expect(
      screen.getByRole('heading', { name: 'Locations', level: 1 }),
    ).toBeInTheDocument();
  });
});
