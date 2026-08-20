import type { ReactNode } from 'react';

export interface FatalBoundaryProps {
  children: ReactNode;
}

export interface FatalBoundaryState {
  readonly error: Error | null;
}
