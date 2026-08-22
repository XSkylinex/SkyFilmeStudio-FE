import type { RuntimeVerdict } from 'sky-filme-studio-be/contracts';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

export const RUNTIME_VERDICT_TONE: Record<RuntimeVerdict, StatusTone> = {
  WITHIN_TOLERANCE: STATUS_TONE.SUCCESS,
  SHORT: STATUS_TONE.DANGER,
  LONG: STATUS_TONE.DANGER,
};
