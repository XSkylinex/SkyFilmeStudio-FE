import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from '@/lib/components/toast';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('Toast', () => {
  it('announces politely by default, via role="status"', () => {
    render(<Toast tone={STATUS_TONE.SUCCESS} title="Shot approved" />);

    expect(screen.getByRole('status')).toHaveTextContent('Shot approved');
  });

  it('announces assertively for a danger tone, via role="alert"', () => {
    render(<Toast tone={STATUS_TONE.DANGER} title="Render failed" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Render failed');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders the description only when given', () => {
    const { container, rerender } = render(
      <Toast tone={STATUS_TONE.NEUTRAL} title="Queued" />,
    );
    expect(
      container.querySelector('.toast__description'),
    ).not.toBeInTheDocument();

    rerender(
      <Toast
        tone={STATUS_TONE.NEUTRAL}
        title="Queued"
        description="Waiting for a free GPU slot"
      />,
    );
    expect(screen.getByText('Waiting for a free GPU slot')).toBeInTheDocument();
  });

  it('renders no dismiss control when onDismiss is not given', () => {
    render(<Toast tone={STATUS_TONE.NEUTRAL} title="Queued" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('reuses IconButton for dismiss and calls onDismiss when clicked', async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn<() => void>();
    render(
      <Toast
        tone={STATUS_TONE.NEUTRAL}
        title="Queued"
        onDismiss={handleDismiss}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
