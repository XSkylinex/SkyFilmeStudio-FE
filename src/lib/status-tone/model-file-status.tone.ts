import type { ModelFileStatusValue } from 'sky-filme-studio-be/contracts';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

export const MODEL_FILE_STATUS_TONE: Record<ModelFileStatusValue, StatusTone> =
  {
    VERIFIED: STATUS_TONE.SUCCESS,
    PRESENT_UNVERIFIABLE: STATUS_TONE.WARNING,
    MISSING: STATUS_TONE.DANGER,
    SIZE_MISMATCH: STATUS_TONE.DANGER,
    HASH_MISMATCH: STATUS_TONE.DANGER,
    UNREADABLE: STATUS_TONE.DANGER,
  };
