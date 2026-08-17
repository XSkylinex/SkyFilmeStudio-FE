import { render, screen } from '@testing-library/react';
import { ProgressBar } from '@/lib/components/progress-bar';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('ProgressBar', () => {
  it('exposes a determinate value through the progressbar ARIA triplet', () => {
    const { container } = render(
      <ProgressBar
        label="Shot 4 render progress"
        tone={STATUS_TONE.ACTIVE}
        indeterminate={false}
        value={40}
      />,
    );
    const bar = container.querySelector('.progress-bar');

    expect(bar).toHaveAttribute('role', 'progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('omits aria-valuenow entirely when indeterminate, rather than reporting 0', () => {
    const { container } = render(
      <ProgressBar
        label="Shot 4 render progress"
        tone={STATUS_TONE.ACTIVE}
        indeterminate
      />,
    );
    const bar = container.querySelector('.progress-bar');

    expect(bar).toHaveAttribute('data-indeterminate', 'true');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('passes the fill percentage to CSS as a custom property, not an inline width', () => {
    const { container } = render(
      <ProgressBar
        label="Shot 4 render progress"
        tone={STATUS_TONE.SUCCESS}
        indeterminate={false}
        value={75}
      />,
    );
    const fill = container.querySelector<HTMLDivElement>('.progress-bar__fill');

    expect(fill?.style.getPropertyValue('--progress-value')).toBe('75%');
  });

  it('requires a distinguishing accessible name, so thirty rows do not all announce the same thing', () => {
    render(
      <ProgressBar
        label="Shot 4 render progress"
        tone={STATUS_TONE.ACTIVE}
        indeterminate={false}
        value={40}
      />,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Shot 4 render progress' }),
    ).toBeInTheDocument();
  });

  it('gives an indeterminate bar the same accessible name treatment', () => {
    render(
      <ProgressBar
        label="Shot 5 render progress"
        tone={STATUS_TONE.ACTIVE}
        indeterminate
      />,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Shot 5 render progress' }),
    ).toBeInTheDocument();
  });
});
