import type { ChangeEventHandler } from 'react';
import { screen } from '@testing-library/react';
import { renderInStore } from '../../../render-in-store';
import userEvent from '@testing-library/user-event';
import { Input } from '@/lib/components/input';
import { Field } from '@/lib/components/field';

describe('Input', () => {
  it('defaults to type="text"', () => {
    renderInStore(<Input placeholder="Seed" />);

    expect(screen.getByPlaceholderText('Seed')).toHaveAttribute('type', 'text');
  });

  it('renders the type the caller chose', () => {
    renderInStore(<Input type="number" placeholder="Duration" />);

    expect(screen.getByPlaceholderText('Duration')).toHaveAttribute(
      'type',
      'number',
    );
  });

  it('reflects the caller-controlled value', () => {
    renderInStore(
      <Input
        value="42"
        onChange={vi.fn<ChangeEventHandler<HTMLInputElement>>()}
        placeholder="Seed"
      />,
    );

    expect(screen.getByPlaceholderText('Seed')).toHaveValue('42');
  });

  it('calls onChange with what the caller typed', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn<ChangeEventHandler<HTMLInputElement>>();
    renderInStore(
      <Input defaultValue="" onChange={handleChange} placeholder="Seed" />,
    );

    await user.type(screen.getByPlaceholderText('Seed'), '7');

    expect(handleChange).toHaveBeenCalled();
  });

  it('composes with Field, taking its generated id, aria-describedby and aria-invalid', () => {
    renderInStore(
      <Field label="Seed" error="Must be a whole number">
        <Input />
      </Field>,
    );
    const control = screen.getByLabelText('Seed');

    expect(control.tagName).toBe('INPUT');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    const describedBy = control.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Must be a whole number',
    );
  });
});
