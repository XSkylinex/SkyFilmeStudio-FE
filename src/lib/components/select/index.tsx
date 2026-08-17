import type { ChangeEvent, FC } from 'react';
import type { SelectProps } from './select.interface';
import './select.css';

export const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  disabled,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value);
  };

  return (
    <select
      className="select"
      id={id}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
