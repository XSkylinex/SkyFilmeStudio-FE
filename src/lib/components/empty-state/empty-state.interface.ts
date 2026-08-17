import type { ReactNode } from 'react';
import type { HeadingLevel } from '@/lib/interfaces/heading-level';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  headingLevel?: HeadingLevel | undefined;
}
