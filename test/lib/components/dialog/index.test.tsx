import { StrictMode } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import { Dialog } from '@/lib/components/dialog';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Dialog', () => {
  it('calls showModal when open becomes true', () => {
    const { rerender } = renderInStore(
      <Dialog
        open={false}
        title="Approve keyframe"
        onClose={vi.fn<() => void>()}
      >
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', {
      hidden: true,
    }) as HTMLDialogElement;
    const showModalSpy = vi.spyOn(dialog, 'showModal');

    rerender(
      <Dialog open title="Approve keyframe" onClose={vi.fn<() => void>()}>
        <p>Body</p>
      </Dialog>,
    );

    expect(showModalSpy).toHaveBeenCalledTimes(1);
  });

  it('calls close when open becomes false', () => {
    const { rerender } = renderInStore(
      <Dialog open title="Approve keyframe" onClose={vi.fn<() => void>()}>
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', {
      hidden: true,
    }) as HTMLDialogElement;
    const closeSpy = vi.spyOn(dialog, 'close');

    rerender(
      <Dialog
        open={false}
        title="Approve keyframe"
        onClose={vi.fn<() => void>()}
      >
        <p>Body</p>
      </Dialog>,
    );

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('guards showModal on the element’s own open property, so a StrictMode double-invoke does not throw', () => {
    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, 'showModal');

    renderInStore(
      <StrictMode>
        <Dialog open title="Approve keyframe" onClose={vi.fn<() => void>()}>
          <p>Body</p>
        </Dialog>
      </StrictMode>,
    );

    expect(showModalSpy).toHaveBeenCalledTimes(1);
  });

  it('calls onClose exactly once for one Escape press, which fires cancel then close', () => {
    const handleClose = vi.fn<() => void>();
    renderInStore(
      <Dialog open title="Approve keyframe" onClose={handleClose}>
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { hidden: true });
    const cancelEvent = new Event('cancel', { cancelable: true });

    fireEvent(dialog, cancelEvent);
    fireEvent(dialog, new Event('close'));

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(cancelEvent.defaultPrevented).toBe(false);
  });

  it('calls onClose on the native close event, so the open prop cannot desync', () => {
    const handleClose = vi.fn<() => void>();
    renderInStore(
      <Dialog open title="Approve keyframe" onClose={handleClose}>
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { hidden: true });

    fireEvent(dialog, new Event('close'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the parent closed it by flipping the open prop', () => {
    const handleClose = vi.fn<() => void>();
    const { rerender } = renderInStore(
      <Dialog open title="Approve keyframe" onClose={handleClose}>
        <p>Body</p>
      </Dialog>,
    );

    rerender(
      <Dialog open={false} title="Approve keyframe" onClose={handleClose}>
        <p>Body</p>
      </Dialog>,
    );

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('uses the title as the accessible name, via aria-labelledby', () => {
    renderInStore(
      <Dialog open title="Approve keyframe" onClose={vi.fn<() => void>()}>
        <p>Body</p>
      </Dialog>,
    );

    expect(
      screen.getByRole('dialog', { hidden: true, name: 'Approve keyframe' }),
    ).toBeInTheDocument();
  });

  it('defaults its title to a level-2 heading', () => {
    renderInStore(
      <Dialog open title="Approve keyframe" onClose={vi.fn<() => void>()}>
        <p>Body</p>
      </Dialog>,
    );

    expect(
      screen.getByRole('heading', { name: 'Approve keyframe', level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders its title at the heading level the caller chose', () => {
    renderInStore(
      <Dialog
        open
        title="Approve keyframe"
        onClose={vi.fn<() => void>()}
        headingLevel={3}
      >
        <p>Body</p>
      </Dialog>,
    );

    expect(
      screen.getByRole('heading', { name: 'Approve keyframe', level: 3 }),
    ).toBeInTheDocument();
  });

  it('renders the footer only when given', () => {
    const { container, rerender } = renderInStore(
      <Dialog open title="Approve keyframe" onClose={vi.fn<() => void>()}>
        <p>Body</p>
      </Dialog>,
    );
    expect(container.querySelector('.dialog__footer')).not.toBeInTheDocument();

    rerender(
      <Dialog
        open
        title="Approve keyframe"
        onClose={vi.fn<() => void>()}
        footer={<button type="button">Approve</button>}
      >
        <p>Body</p>
      </Dialog>,
    );
    expect(container.querySelector('.dialog__footer')).toBeInTheDocument();
  });
});
