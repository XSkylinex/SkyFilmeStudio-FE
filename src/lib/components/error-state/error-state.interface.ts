import type { ReactNode } from 'react';
import type { HeadingLevel } from '@/lib/interfaces/heading-level';

export interface ErrorStateProps {
  title: string;
  description?: ReactNode;
  detail?: string | undefined;
  action?: ReactNode;
  headingLevel?: HeadingLevel | undefined;
}
