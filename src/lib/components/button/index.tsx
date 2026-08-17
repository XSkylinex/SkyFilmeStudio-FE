import type { FC } from 'react';
import type { ButtonProps } from './button.interface';
import './button.css';

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  shape = 'text',
  type = 'button',
  disabled,
  onClick,
  'aria-label': label,
  'aria-expanded': expanded,
  'aria-controls': controls,
  'aria-describedby': describedBy,
  children,
}) => (
  <button
    className="button"
    data-variant={variant}
    data-size={size}
    data-shape={shape}
    type={type}
    disabled={disabled}
    aria-label={label}
    aria-expanded={expanded}
    aria-controls={controls}
    aria-describedby={describedBy}
    onClick={onClick}
  >
    {children}
  </button>
);
