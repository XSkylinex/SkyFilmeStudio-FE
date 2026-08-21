import type { ReactNode } from 'react';

export interface FatalErrorViewProps {
  readonly detail?: string | undefined;
  readonly description?: ReactNode;
}
