import { render, screen } from '@testing-library/react';
import { VoicesPage } from '@/features/voices/VoicesPage';

describe('VoicesPage', () => {
  it('renders the voices empty state', () => {
    render(<VoicesPage />);

    expect(
      screen.getByRole('heading', { name: 'Voices', level: 1 }),
    ).toBeInTheDocument();
  });
});
