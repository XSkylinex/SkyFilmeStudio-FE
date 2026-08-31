import type { MouseEventHandler, ReactNode } from 'react';
import type { ButtonShape } from '@/lib/interfaces/button-shape';
import type { ButtonSize } from '@/lib/interfaces/button-size';
import type { ButtonType } from '@/lib/interfaces/button-type';
import type { ButtonVariant } from '@/lib/interfaces/button-variant';

export interface ButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  shape?: ButtonShape | undefined;
  type?: ButtonType | undefined;
  disabled?: boolean | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  'aria-label'?: string | undefined;
  'aria-expanded'?: boolean | undefined;
  'aria-controls'?: string | undefined;
  'aria-describedby'?: string | undefined;
  'aria-pressed'?: boolean | undefined;
  children: ReactNode;
}
