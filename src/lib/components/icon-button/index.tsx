import type { FC } from 'react';
import type { IconButtonProps } from './icon-button.interface';
import './icon-button.css';

export const IconButton: FC<IconButtonProps> = ({
  variant,
  size,
  label,
  type = 'button',
  disabled,
  onClick,
  children,
}) => (
  <button
    className="icon-button"
    data-variant={variant}
    data-size={size}
    type={type}
    disabled={disabled}
    aria-label={label}
    onClick={onClick}
  >
    {children}
  </button>
);
