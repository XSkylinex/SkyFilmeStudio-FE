import { renderInStore } from '../../../render-in-store';
import { Skeleton } from '@/lib/components/skeleton';

describe('Skeleton', () => {
  it('hides itself from assistive tech, since the owning region announces loading', () => {
    const { container } = renderInStore(<Skeleton shape="text" />);

    expect(container.querySelector('.skeleton')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('carries its shape on data-shape', () => {
    const { container } = renderInStore(<Skeleton shape="circle" />);

    expect(container.querySelector('.skeleton')).toHaveAttribute(
      'data-shape',
      'circle',
    );
  });
});
