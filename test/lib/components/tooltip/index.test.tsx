import { render, screen } from '@testing-library/react';
import { Tooltip } from '@/lib/components/tooltip';

describe('Tooltip', () => {
  it('keeps the tip text in the DOM without any hover or focus', () => {
    render(
      <Tooltip label="Measured on this hardware profile">
        <button type="button">Duration</button>
      </Tooltip>,
    );

    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'Measured on this hardware profile',
    );
  });

  it('describes the child through aria-describedby, pointing at the tip', () => {
    render(
      <Tooltip label="Measured on this hardware profile">
        <button type="button">Duration</button>
      </Tooltip>,
    );
    const control = screen.getByRole('button', { name: 'Duration' });
    const describedBy = control.getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    expect(screen.getByRole('tooltip')).toHaveAttribute(
      'id',
      describedBy as string,
    );
  });

  it('merges with an aria-describedby the child already carries', () => {
    render(
      <Tooltip label="Measured on this hardware profile">
        <button type="button" aria-describedby="existing-hint">
          Duration
        </button>
      </Tooltip>,
    );
    const control = screen.getByRole('button', { name: 'Duration' });
    const describedBy = control.getAttribute('aria-describedby');

    expect(describedBy?.split(' ')).toHaveLength(2);
    expect(describedBy?.split(' ')[0]).toBe('existing-hint');
  });
});
