import { render } from '@testing-library/react';
import { Icon } from '@/lib/components/icon';

describe('Icon', () => {
  it('renders the icon class', () => {
    const { container } = render(<Icon name="close" />);

    expect(container.querySelector('.icon')).toBeInTheDocument();
  });

  it('carries its name on data-icon, so the mask can select it', () => {
    const { container } = render(<Icon name="circle" />);

    expect(container.querySelector('.icon')).toHaveAttribute(
      'data-icon',
      'circle',
    );
  });

  it('hides itself from assistive tech, since the containing control carries the label', () => {
    const { container } = render(<Icon name="close" />);

    expect(container.querySelector('.icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
