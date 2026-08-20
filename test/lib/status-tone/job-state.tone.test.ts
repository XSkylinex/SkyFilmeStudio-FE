import { JOB_STATE, TERMINAL_JOB_STATES } from 'sky-filme-studio-be/contracts';
import { JOB_STATE_TONE } from '@/lib/status-tone/job-state.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('JOB_STATE_TONE', () => {
  it('covers every job state the contract defines, so a new one cannot render untoned', () => {
    expect(Object.keys(JOB_STATE_TONE).sort()).toEqual(
      Object.values(JOB_STATE).sort(),
    );
  });

  it('separates a retryable failure from a final one, because only one of them ends the job', () => {
    expect(JOB_STATE_TONE.FAILED_RETRYABLE).toBe(STATUS_TONE.WARNING);
    expect(JOB_STATE_TONE.FAILED_FINAL).toBe(STATUS_TONE.DANGER);
  });

  it('gives STALE its own tone, since it requeues rather than terminating', () => {
    expect(JOB_STATE_TONE.STALE).toBe(STATUS_TONE.STALE);
    expect(TERMINAL_JOB_STATES).not.toContain(JOB_STATE.STALE);
  });
});
