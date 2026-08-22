import type { FC } from 'react';
import type { TextareaProps } from './textarea.interface';
import './textarea.css';

const TEXTAREA_DEFAULT_ROWS = 4;

export const Textarea: FC<TextareaProps> = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  rows = TEXTAREA_DEFAULT_ROWS,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}) => (
  <textarea
    className="textarea"
    id={id}
    dir="auto"
    rows={rows}
    value={value}
    defaultValue={defaultValue}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    aria-describedby={ariaDescribedBy}
    aria-invalid={ariaInvalid}
  />
);
