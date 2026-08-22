import type { ChangeEventHandler } from 'react';
import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import userEvent from '@testing-library/user-event';
import { Textarea } from '@/lib/components/textarea';
import { Field } from '@/lib/components/field';

describe('Textarea', () => {
  it('defaults to 4 rows', () => {
    renderInStore(<Textarea placeholder="Brief" />);

    expect(screen.getByPlaceholderText('Brief')).toHaveAttribute('rows', '4');
  });

  it('renders the rows the caller chose', () => {
    renderInStore(<Textarea rows={8} placeholder="Brief" />);

    expect(screen.getByPlaceholderText('Brief')).toHaveAttribute('rows', '8');
  });

  it('reflects the caller-controlled value', () => {
    renderInStore(
      <Textarea
        value="A retired safecracker takes one last job."
        onChange={vi.fn<ChangeEventHandler<HTMLTextAreaElement>>()}
        placeholder="Brief"
      />,
    );

    expect(screen.getByPlaceholderText('Brief')).toHaveValue(
      'A retired safecracker takes one last job.',
    );
  });

  it('calls onChange with what the caller typed', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn<ChangeEventHandler<HTMLTextAreaElement>>();
    renderInStore(
      <Textarea defaultValue="" onChange={handleChange} placeholder="Brief" />,
    );

    await user.type(screen.getByPlaceholderText('Brief'), 'One last job.');

    expect(handleChange).toHaveBeenCalled();
  });

  it('composes with Field, taking its generated id, aria-describedby and aria-invalid', () => {
    renderInStore(
      <Field label="Brief" error="Keep it under 500 characters">
        <Textarea />
      </Field>,
    );
    const control = screen.getByLabelText('Brief');

    expect(control.tagName).toBe('TEXTAREA');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    const describedBy = control.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Keep it under 500 characters',
    );
  });

  it('takes its direction from what is typed, so a Hebrew brief reads correctly in an English shell', () => {
    renderInStore(<Textarea placeholder="Brief" />);

    expect(screen.getByPlaceholderText('Brief')).toHaveAttribute('dir', 'auto');
  });
});
