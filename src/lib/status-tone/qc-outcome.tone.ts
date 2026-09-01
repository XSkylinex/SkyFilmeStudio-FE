import type { QcOutcome } from 'sky-filme-studio-be/contracts';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

export const QC_OUTCOME_TONE: Record<QcOutcome, StatusTone> = {
  PASS: STATUS_TONE.READY,
  WARN: STATUS_TONE.WARNING,
  FAIL: STATUS_TONE.DANGER,
  SKIPPED: STATUS_TONE.NEUTRAL,
};
