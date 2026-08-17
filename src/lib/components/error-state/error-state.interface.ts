import type { ReactNode } from 'react';
import type { HeadingLevel } from '@/lib/interfaces/heading-level';

export interface ErrorStateProps {
  title: string;
  description?: string;
  detail?: string;
  action?: ReactNode;
  headingLevel?: HeadingLevel | undefined;
}
