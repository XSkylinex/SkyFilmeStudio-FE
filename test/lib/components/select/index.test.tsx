import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/lib/components/select';
import { Field } from '@/lib/components/field';

type ChangeHandler = (value: string) => void;

const DURATION_OPTIONS = [
  { value: '4', label: '4 seconds' },
  { value: '8', label: '8 seconds' },
];

describe('Select', () => {
  it('renders every option the caller passed, by full label text', () => {
    render(
      <Select
        options={DURATION_OPTIONS}
        value="4"
        onChange={vi.fn<ChangeHandler>()}
      />,
    );

    expect(
      screen.getByRole('option', { name: '4 seconds' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: '8 seconds' }),
    ).toBeInTheDocument();
  });

  it('reflects the caller-controlled value', () => {
    render(
      <Select
        options={DURATION_OPTIONS}
        value="8"
        onChange={vi.fn<ChangeHandler>()}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveValue('8');
  });

  it('calls onChange with the newly picked value, never the previous one', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn<ChangeHandler>();
    render(
      <Select options={DURATION_OPTIONS} value="4" onChange={handleChange} />,
    );

    await user.selectOptions(screen.getByRole('combobox'), '8 seconds');
    expect(handleChange).toHaveBeenCalledWith('8');
  });

  it('never advertises a duration the capability payload did not include', () => {
    render(
      <Select
        options={DURATION_OPTIONS}
        value="4"
        onChange={vi.fn<ChangeHandler>()}
      />,
    );

    expect(
      screen.queryByRole('option', { name: '12 seconds' }),
    ).not.toBeInTheDocument();
  });

  it('composes with Field, taking its generated id and aria-describedby', () => {
    render(
      <Field label="Duration" hint="From the capability payload">
        <Select
          options={DURATION_OPTIONS}
          value="4"
          onChange={vi.fn<ChangeHandler>()}
        />
      </Field>,
    );
    const control = screen.getByLabelText('Duration');

    expect(control.tagName).toBe('SELECT');
    expect(control).toHaveAttribute('aria-describedby');
  });
});
