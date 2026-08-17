import { render, screen } from '@testing-library/react';
import { TimelinePage } from '@/features/timeline/TimelinePage';

describe('TimelinePage', () => {
  it('renders the timeline empty state', () => {
    render(<TimelinePage />);

    expect(
      screen.getByRole('heading', { name: 'Timeline' }),
    ).toBeInTheDocument();
  });
});
