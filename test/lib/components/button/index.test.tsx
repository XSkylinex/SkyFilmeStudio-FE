import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import userEvent from '@testing-library/user-event';
import { Button } from '@/lib/components/button';

describe('Button', () => {
  it('defaults to type="button", so it never submits an enclosing form by accident', () => {
    renderInStore(
      <Button variant="primary" size="md">
        Approve
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Approve' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('honours an explicit type', () => {
    renderInStore(
      <Button variant="primary" size="md" type="submit">
        Save
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'submit',
    );
  });

  it('carries the variant and size the caller chose', () => {
    renderInStore(
      <Button variant="danger" size="sm">
        Reject
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Reject' });

    expect(button).toHaveAttribute('data-variant', 'danger');
    expect(button).toHaveAttribute('data-size', 'sm');
  });

  it('stays disabled exactly as the caller decided, owning no submitting state of its own', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn<() => void>();
    renderInStore(
      <Button variant="primary" size="md" disabled onClick={handleClick}>
        Approve
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Approve' });

    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('calls the caller-supplied handler when enabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn<() => void>();
    renderInStore(
      <Button variant="primary" size="md" onClick={handleClick}>
        Approve
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Approve' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('forwards aria-pressed, so a selected-state control reports it rather than relying on colour', () => {
    renderInStore(
      <Button variant="primary" size="md" aria-pressed>
        Version
      </Button>,
    );

    expect(screen.getByRole('button', { pressed: true })).toBeInTheDocument();
  });

  it('forwards aria-describedby, so a wrapping Tooltip actually describes it', () => {
    renderInStore(
      <>
        <Button variant="primary" size="md" aria-describedby="tip-approve">
          Approve
        </Button>
        <span id="tip-approve">Locks the keyframe for every later render</span>
      </>,
    );
    const button = screen.getByRole('button', { name: 'Approve' });

    expect(
      document.getElementById(
        button.getAttribute('aria-describedby') as string,
      ),
    ).toHaveTextContent('Locks the keyframe for every later render');
  });
});
