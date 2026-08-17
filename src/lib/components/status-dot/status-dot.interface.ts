import type { StatusTone } from '@/lib/interfaces/status-tone';

export type StatusDotForm =
  'solid' | 'ring' | 'half' | 'dashed' | 'cross' | 'diamond';

export interface StatusDotProps {
  tone: StatusTone;
}
