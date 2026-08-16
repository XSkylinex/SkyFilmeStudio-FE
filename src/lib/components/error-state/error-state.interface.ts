import type { ReactNode } from 'react';

export interface ErrorStateProps {
  title: string;
  description?: string;
  detail?: string;
  action?: ReactNode;
}
