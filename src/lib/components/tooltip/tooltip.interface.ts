import type { ReactElement } from 'react';

export interface TooltipChildProps {
  'aria-describedby'?: string | undefined;
}

export interface TooltipProps {
  label: string;
  children: ReactElement<TooltipChildProps>;
}
