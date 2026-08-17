import type { FC } from 'react';
import { Button } from '@/lib/components/button';
import type { IconButtonProps } from './icon-button.interface';

export const IconButton: FC<IconButtonProps> = ({
  variant,
  size,
  label,
  type,
  disabled,
  onClick,
  'aria-describedby': describedBy,
  children,
}) => (
  <Button
    variant={variant}
    size={size}
    shape="icon"
    type={type}
    disabled={disabled}
    onClick={onClick}
    aria-label={label}
    aria-describedby={describedBy}
  >
    {children}
  </Button>
);
