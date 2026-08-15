import type { StatusTone } from '@/lib/interfaces/status-tone';

export type ProgressBarProps =
  | {
      tone: StatusTone;
      indeterminate: true;
    }
  | {
      tone: StatusTone;
      indeterminate: false;
      value: number;
    };
