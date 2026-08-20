import { renderInStore } from '../../../render-in-store';
import { Icon } from '@/lib/components/icon';

describe('Icon', () => {
  it('renders the icon class', () => {
    const { container } = renderInStore(<Icon name="close" />);

    expect(container.querySelector('.icon')).toBeInTheDocument();
  });

  it('carries its name on data-icon, so the mask can select it', () => {
    const { container } = renderInStore(<Icon name="circle" />);

    expect(container.querySelector('.icon')).toHaveAttribute(
      'data-icon',
      'circle',
    );
  });

  it('hides itself from assistive tech, since the containing control carries the label', () => {
    const { container } = renderInStore(<Icon name="close" />);

    expect(container.querySelector('.icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
