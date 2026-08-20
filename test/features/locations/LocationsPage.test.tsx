import { render, screen } from '@testing-library/react';
import { LocationsPage } from '@/features/locations/LocationsPage';

describe('LocationsPage', () => {
  it('renders the locations empty state', () => {
    render(<LocationsPage />);

    expect(
      screen.getByRole('heading', { name: 'Locations', level: 1 }),
    ).toBeInTheDocument();
  });
});
