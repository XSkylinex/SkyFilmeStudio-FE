import type { ApprovalState } from 'sky-filme-studio-be/contracts';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

export const APPROVAL_STATE_TONE: Record<ApprovalState, StatusTone> = {
  PENDING: STATUS_TONE.ATTENTION,
  APPROVED: STATUS_TONE.SUCCESS,
  REJECTED: STATUS_TONE.DANGER,
};
