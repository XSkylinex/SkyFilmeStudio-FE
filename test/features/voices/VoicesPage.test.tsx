import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { VoicesPage } from '@/features/voices/VoicesPage';

describe('VoicesPage', () => {
  it('renders the voices empty state', () => {
    renderInStore(<VoicesPage />);

    expect(
      screen.getByRole('heading', { name: 'Voices', level: 1 }),
    ).toBeInTheDocument();
  });
});
