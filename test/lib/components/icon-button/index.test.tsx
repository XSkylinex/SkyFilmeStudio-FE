import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '@/lib/components/icon-button';

describe('IconButton', () => {
  it('exposes the required label as its accessible name, since the icon carries none', () => {
    render(
      <IconButton variant="ghost" size="sm" label="Cancel render">
        <svg aria-hidden="true" />
      </IconButton>,
    );

    expect(
      screen.getByRole('button', { name: 'Cancel render' }),
    ).toBeInTheDocument();
  });

  it('defaults to type="button"', () => {
    render(
      <IconButton variant="primary" size="md" label="Retake">
        <svg aria-hidden="true" />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Retake' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('carries the variant and size the caller chose', () => {
    render(
      <IconButton variant="danger" size="sm" label="Reject">
        <svg aria-hidden="true" />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Reject' });

    expect(button).toHaveAttribute('data-variant', 'danger');
    expect(button).toHaveAttribute('data-size', 'sm');
  });

  it('does not call the handler while disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn<() => void>();
    render(
      <IconButton
        variant="primary"
        size="md"
        label="Export"
        disabled
        onClick={handleClick}
      >
        <svg aria-hidden="true" />
      </IconButton>,
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
