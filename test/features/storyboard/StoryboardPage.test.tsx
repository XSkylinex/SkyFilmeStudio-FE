import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { StoryboardPage } from '@/features/storyboard/StoryboardPage';

describe('StoryboardPage', () => {
  it('renders the storyboard empty state', () => {
    renderInStore(<StoryboardPage />);

    expect(
      screen.getByRole('heading', { name: 'Storyboard', level: 1 }),
    ).toBeInTheDocument();
  });
});
