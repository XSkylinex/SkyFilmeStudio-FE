import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Icon } from '@/lib/components/icon';
import { IconButton } from '@/lib/components/icon-button';

describe('IconButton', () => {
  it('exposes the required label as its accessible name, since the icon carries none', () => {
    render(
      <IconButton variant="ghost" size="sm" label="Cancel render">
        <Icon name="close" />
      </IconButton>,
    );

    expect(
      screen.getByRole('button', { name: 'Cancel render' }),
    ).toBeInTheDocument();
  });

  it('defaults to type="button"', () => {
    render(
      <IconButton variant="primary" size="md" label="Retake">
        <Icon name="close" />
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
        <Icon name="close" />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Reject' });

    expect(button).toHaveAttribute('data-variant', 'danger');
    expect(button).toHaveAttribute('data-size', 'sm');
  });

  it('renders Button in its icon shape rather than a second button of its own', () => {
    render(
      <IconButton variant="ghost" size="md" label="Cancel render">
        <Icon name="close" />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Cancel render' });

    expect(button).toHaveClass('button');
    expect(button).toHaveAttribute('data-shape', 'icon');
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
        <Icon name="close" />
      </IconButton>,
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards aria-describedby, so a wrapping Tooltip actually describes it', () => {
    render(
      <>
        <IconButton
          variant="ghost"
          size="sm"
          label="Retake region"
          aria-describedby="tip-retake"
        >
          <Icon name="close" />
        </IconButton>
        <span id="tip-retake">Re-renders only the masked area</span>
      </>,
    );
    const button = screen.getByRole('button', { name: 'Retake region' });

    expect(
      document.getElementById(
        button.getAttribute('aria-describedby') as string,
      ),
    ).toHaveTextContent('Re-renders only the masked area');
  });
});
