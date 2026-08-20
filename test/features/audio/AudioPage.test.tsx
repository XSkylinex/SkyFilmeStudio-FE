import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { AudioPage } from '@/features/audio/AudioPage';

describe('AudioPage', () => {
  it('renders the audio empty state', () => {
    renderInStore(<AudioPage />);

    expect(
      screen.getByRole('heading', { name: 'Audio', level: 1 }),
    ).toBeInTheDocument();
  });
});
