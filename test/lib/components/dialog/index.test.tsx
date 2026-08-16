import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Dialog } from '@/lib/components/dialog';

beforeAll(() => {
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function (
      this: HTMLDialogElement,
    ): void {
      this.open = true;
    };
  }
  if (typeof HTMLDialogElement.prototype.close !== 'function') {
    HTMLDialogElement.prototype.close = function (
      this: HTMLDialogElement,
    ): void {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Dialog', () => {
  it('calls showModal when open becomes true', () => {
    const { rerender } = render(
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
    const { rerender } = render(
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

    render(
      <StrictMode>
        <Dialog open title="Approve keyframe" onClose={vi.fn<() => void>()}>
          <p>Body</p>
        </Dialog>
      </StrictMode>,
    );

    expect(showModalSpy).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on the native cancel event, without preventing it', () => {
    const handleClose = vi.fn<() => void>();
    render(
      <Dialog open title="Approve keyframe" onClose={handleClose}>
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { hidden: true });
    const event = new Event('cancel', { cancelable: true });

    fireEvent(dialog, event);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(false);
  });

  it('calls onClose on the native close event, so the open prop cannot desync', () => {
    const handleClose = vi.fn<() => void>();
    render(
      <Dialog open title="Approve keyframe" onClose={handleClose}>
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { hidden: true });

    fireEvent(dialog, new Event('close'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('uses the title as the accessible name, via aria-labelledby', () => {
    render(
      <Dialog open title="Approve keyframe" onClose={vi.fn<() => void>()}>
        <p>Body</p>
      </Dialog>,
    );

    expect(
      screen.getByRole('dialog', { hidden: true, name: 'Approve keyframe' }),
    ).toBeInTheDocument();
  });

  it('renders the footer only when given', () => {
    const { container, rerender } = render(
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
