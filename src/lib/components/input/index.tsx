import type { FC } from 'react';
import type { InputProps } from './input.interface';
import './input.css';

export const Input: FC<InputProps> = ({
  type = 'text',
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
}) => (
  <input
    className="input"
    id={id}
    dir="auto"
    type={type}
    value={value}
    defaultValue={defaultValue}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    aria-describedby={ariaDescribedBy}
    aria-invalid={ariaInvalid}
    aria-required={ariaRequired}
  />
);
