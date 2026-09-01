import type { ReactElement } from 'react';
import type { FieldControlProps } from '@/lib/interfaces/field-control-props';

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  id?: string;
  children: ReactElement<FieldControlProps>;
}
