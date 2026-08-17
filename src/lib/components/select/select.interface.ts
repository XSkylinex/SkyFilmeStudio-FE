import type { FieldControlProps } from '@/lib/interfaces/field-control-props';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends FieldControlProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean | undefined;
}
