import type { ReactElement } from 'react';

export interface FieldControlProps {
  id?: string | undefined;
  'aria-describedby'?: string | undefined;
  'aria-invalid'?: boolean | undefined;
}

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
  children: ReactElement<FieldControlProps>;
}
