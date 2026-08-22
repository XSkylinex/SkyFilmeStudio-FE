import type { ChangeEventHandler } from 'react';
import type { FieldControlProps } from '@/lib/interfaces/field-control-props';

export interface TextareaProps extends FieldControlProps {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  rows?: number | undefined;
}
