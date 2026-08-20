import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import { Badge } from '@/lib/components/badge';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('Badge', () => {
  it('renders its label as real text content, not colour-only meaning', () => {
    renderInStore(
      <Badge tone={STATUS_TONE.WARNING} label="FAILED_RETRYABLE" />,
    );

    expect(screen.getByText('FAILED_RETRYABLE')).toBeInTheDocument();
  });

  it('puts the same tone on the badge and on the dot it carries', () => {
    const { container } = renderInStore(
      <Badge tone={STATUS_TONE.DANGER} label="FAILED_FINAL" />,
    );

    expect(container.querySelector('.badge')).toHaveAttribute(
      'data-tone',
      'danger',
    );
    expect(container.querySelector('.status-dot')).toHaveAttribute(
      'data-tone',
      'danger',
    );
  });
});
