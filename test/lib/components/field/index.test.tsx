import { render, screen } from '@testing-library/react';
import { Field } from '@/lib/components/field';

describe('Field', () => {
  it('associates its label with the control, so querying by label finds the control', () => {
    render(
      <Field label="Seed">
        <input />
      </Field>,
    );

    expect(screen.getByLabelText('Seed')).toBeInstanceOf(HTMLInputElement);
  });

  it('uses the caller-supplied id instead of generating one', () => {
    render(
      <Field label="Seed" id="seed-input">
        <input />
      </Field>,
    );

    expect(screen.getByLabelText('Seed')).toHaveAttribute('id', 'seed-input');
  });

  it('links the hint through aria-describedby', () => {
    render(
      <Field label="Duration" hint="Seconds, from the capability payload">
        <input />
      </Field>,
    );
    const control = screen.getByLabelText('Duration');
    const describedBy = control.getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Seconds, from the capability payload',
    );
  });

  it('sets aria-invalid and links the error text when errored', () => {
    render(
      <Field label="Duration" error="Exceeds the tested maximum">
        <input />
      </Field>,
    );
    const control = screen.getByLabelText('Duration');

    expect(control).toHaveAttribute('aria-invalid', 'true');
    const describedBy = control.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Exceeds the tested maximum',
    );
  });

  it('does not mark a hint-only field as invalid', () => {
    render(
      <Field label="Duration" hint="Seconds">
        <input />
      </Field>,
    );

    expect(screen.getByLabelText('Duration')).not.toHaveAttribute(
      'aria-invalid',
    );
  });

  it('describes the control by both hint and error when both are present', () => {
    render(
      <Field label="Duration" hint="Seconds" error="Too long">
        <input />
      </Field>,
    );
    const control = screen.getByLabelText('Duration');
    const describedBy = control.getAttribute('aria-describedby');

    expect(describedBy?.split(' ')).toHaveLength(2);
  });
});
