import type { ChangeEventHandler } from 'react';

export type InputType = 'text' | 'number' | 'search';

export interface InputProps {
  type?: InputType;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
  id?: string | undefined;
  'aria-describedby'?: string | undefined;
  'aria-invalid'?: boolean | undefined;
}
