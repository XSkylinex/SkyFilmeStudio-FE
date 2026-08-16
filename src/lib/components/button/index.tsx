import type { FC } from 'react';
import type { ButtonProps } from './button.interface';
import './button.css';

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  type = 'button',
  disabled,
  onClick,
  children,
}) => (
  <button
    className="button"
    data-variant={variant}
    data-size={size}
    type={type}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
