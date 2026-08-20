import type { PreflightStatus } from 'sky-filme-studio-be/contracts';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

export const PREFLIGHT_STATUS_TONE: Record<PreflightStatus, StatusTone> = {
  PASS: STATUS_TONE.SUCCESS,
  FAIL: STATUS_TONE.DANGER,
  NOT_APPLICABLE: STATUS_TONE.NEUTRAL,
  NOT_IMPLEMENTED: STATUS_TONE.STALE,
};
