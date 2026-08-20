import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { RenderQueuePage } from '@/features/render-queue/RenderQueuePage';

describe('RenderQueuePage', () => {
  it('renders the render queue empty state', () => {
    renderInStore(<RenderQueuePage />);

    expect(
      screen.getByRole('heading', { name: 'Render queue', level: 1 }),
    ).toBeInTheDocument();
  });
});
