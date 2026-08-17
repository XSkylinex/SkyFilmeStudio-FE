import type { CSSProperties } from 'react';
import type { StatusTone } from '@/lib/interfaces/status-tone';

export interface ProgressFillStyle extends CSSProperties {
  '--progress-value': string;
}

export type ProgressBarProps =
  | {
      label: string;
      tone: StatusTone;
      indeterminate: true;
    }
  | {
      label: string;
      tone: StatusTone;
      indeterminate: false;
      value: number;
    };
