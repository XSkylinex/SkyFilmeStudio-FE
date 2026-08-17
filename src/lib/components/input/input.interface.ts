import type { ChangeEventHandler } from 'react';
import type { FieldControlProps } from '@/lib/interfaces/field-control-props';

export type InputType = 'text' | 'number' | 'search';

export interface InputProps extends FieldControlProps {
  type?: InputType | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
}
