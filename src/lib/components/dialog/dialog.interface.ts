import type { ReactNode } from 'react';
import type { HeadingLevel } from '@/lib/interfaces/heading-level';

export interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  headingLevel?: HeadingLevel | undefined;
}
