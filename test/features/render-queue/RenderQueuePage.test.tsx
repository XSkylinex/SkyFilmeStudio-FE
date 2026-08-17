import { render, screen } from '@testing-library/react';
import { RenderQueuePage } from '@/features/render-queue/RenderQueuePage';

describe('RenderQueuePage', () => {
  it('renders the render queue empty state', () => {
    render(<RenderQueuePage />);

    expect(
      screen.getByRole('heading', { name: 'Render queue' }),
    ).toBeInTheDocument();
  });
});
