import { screen } from '@testing-library/react';
import { ActionResult } from '@/lib/components/action-result';
import { renderInApp } from '../../../render-in-app';

describe('ActionResult', () => {
  it('takes focus when it appears, so a removal is not silent', () => {
    renderInApp(<ActionResult message="It was deleted." attempt={1} />);

    const output = screen.getByText('It was deleted.');

    expect(output).toHaveFocus();
    expect(output.tagName).toBe('OUTPUT');
  });

  it('re-announces a second result rather than staying on the first', () => {
    const { rerender } = renderInApp(
      <ActionResult message="First." attempt={1} />,
    );

    screen.getByText('First.').blur();
    expect(screen.getByText('First.')).not.toHaveFocus();

    rerender(<ActionResult message="Second." attempt={2} />);

    expect(screen.getByText('Second.')).toHaveFocus();
  });
});
