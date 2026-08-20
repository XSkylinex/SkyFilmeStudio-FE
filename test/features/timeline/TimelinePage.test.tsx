import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { TimelinePage } from '@/features/timeline/TimelinePage';

describe('TimelinePage', () => {
  it('renders the timeline empty state', () => {
    renderInStore(<TimelinePage />);

    expect(
      screen.getByRole('heading', { name: 'Timeline', level: 1 }),
    ).toBeInTheDocument();
  });
});
