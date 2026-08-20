import type { QcCheckOutcome } from 'sky-filme-studio-be/contracts';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

export const QC_CHECK_OUTCOME_TONE: Record<QcCheckOutcome, StatusTone> = {
  PASS: STATUS_TONE.READY,
  FAIL: STATUS_TONE.DANGER,
  SKIPPED: STATUS_TONE.NEUTRAL,
};
