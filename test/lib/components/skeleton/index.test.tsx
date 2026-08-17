import { render } from '@testing-library/react';
import { Skeleton } from '@/lib/components/skeleton';

describe('Skeleton', () => {
  it('hides itself from assistive tech, since the owning region announces loading', () => {
    const { container } = render(<Skeleton shape="text" />);

    expect(container.querySelector('.skeleton')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('carries its shape on data-shape', () => {
    const { container } = render(<Skeleton shape="circle" />);

    expect(container.querySelector('.skeleton')).toHaveAttribute(
      'data-shape',
      'circle',
    );
  });
});
