import { APPROVAL_STATE } from 'sky-filme-studio-be/contracts';
import { APPROVAL_STATE_TONE } from '@/lib/status-tone/approval-state.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('APPROVAL_STATE_TONE', () => {
  it('covers every approval state the contract defines', () => {
    expect(Object.keys(APPROVAL_STATE_TONE).sort()).toEqual(
      Object.values(APPROVAL_STATE).sort(),
    );
  });

  it('shows a pending approval as waiting on a person', () => {
    expect(APPROVAL_STATE_TONE.PENDING).toBe(STATUS_TONE.ATTENTION);
  });
});
