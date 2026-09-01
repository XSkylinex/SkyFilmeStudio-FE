import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import { ValidationSummary } from '@/lib/components/validation-summary';

describe('ValidationSummary', () => {
  it('is an output that takes focus when it appears, so a failed submit is heard and landed on', () => {
    renderInStore(<ValidationSummary count={3} attempt={1} />);

    const summary = screen.getByRole('status');

    expect(summary).toHaveTextContent('Fields needing attention: 3');
    expect(summary).toHaveFocus();
  });

  it('takes focus again on the next failed attempt, even though it never unmounted', () => {
    const { rerender } = renderInStore(
      <>
        <button type="button">elsewhere</button>
        <ValidationSummary count={2} attempt={1} />
      </>,
    );

    screen.getByRole('button', { name: 'elsewhere' }).focus();
    expect(screen.getByRole('status')).not.toHaveFocus();

    rerender(
      <>
        <button type="button">elsewhere</button>
        <ValidationSummary count={1} attempt={2} />
      </>,
    );

    expect(screen.getByRole('status')).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Fields needing attention: 1',
    );
  });

  it('does not steal focus on a re-render that is not a new attempt', () => {
    const { rerender } = renderInStore(
      <>
        <button type="button">elsewhere</button>
        <ValidationSummary count={2} attempt={1} />
      </>,
    );

    screen.getByRole('button', { name: 'elsewhere' }).focus();
    rerender(
      <>
        <button type="button">elsewhere</button>
        <ValidationSummary count={2} attempt={1} />
      </>,
    );

    expect(screen.getByRole('button', { name: 'elsewhere' })).toHaveFocus();
  });
});
