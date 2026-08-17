import { render, screen } from '@testing-library/react';
import { AudioPage } from '@/features/audio/AudioPage';

describe('AudioPage', () => {
  it('renders the audio empty state', () => {
    render(<AudioPage />);

    expect(
      screen.getByRole('heading', { name: 'Audio', level: 1 }),
    ).toBeInTheDocument();
  });
});
