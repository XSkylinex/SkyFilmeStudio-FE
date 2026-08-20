import { render, screen } from '@testing-library/react';
import { StoryboardPage } from '@/features/storyboard/StoryboardPage';

describe('StoryboardPage', () => {
  it('renders the storyboard empty state', () => {
    render(<StoryboardPage />);

    expect(
      screen.getByRole('heading', { name: 'Storyboard', level: 1 }),
    ).toBeInTheDocument();
  });
});
