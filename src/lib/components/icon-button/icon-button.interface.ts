import type { MouseEventHandler, ReactNode } from 'react';
import type { ButtonSize } from '@/lib/interfaces/button-size';
import type { ButtonType } from '@/lib/interfaces/button-type';
import type { ButtonVariant } from '@/lib/interfaces/button-variant';

export interface IconButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  label: string;
  type?: ButtonType;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}
