import type { StatusTone } from '@/lib/interfaces/status-tone';

export const STATUS_TONE = {
  NEUTRAL: 'neutral',
  READY: 'ready',
  CHECKING: 'checking',
  ACTIVE: 'active',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  STALE: 'stale',
  ATTENTION: 'attention',
} satisfies Record<string, StatusTone>;
