import type { ReactNode } from 'react';
import type { HeadingLevel } from '@/lib/interfaces/heading-level';

export interface SystemPanelProps {
  title: string;
  headingLevel?: HeadingLevel | undefined;
  children: ReactNode;
}
