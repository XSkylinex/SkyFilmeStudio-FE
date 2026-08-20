import { JOB_STATE } from 'sky-filme-studio-be/contracts';
import type { JobState } from 'sky-filme-studio-be/contracts';
import { isTerminalJobState } from '@/features/render-queue/api/helpers/is-terminal-job-state';

const EXPECTED_TERMINAL_STATES: readonly JobState[] = [
  JOB_STATE.SUCCEEDED,
  JOB_STATE.FAILED_FINAL,
  JOB_STATE.CANCELLED,
];

describe('isTerminalJobState', () => {
  it.each(Object.values(JOB_STATE))(
    'agrees with the terminal-state list for %s',
    (state) => {
      expect(isTerminalJobState(state)).toBe(
        EXPECTED_TERMINAL_STATES.includes(state),
      );
    },
  );

  it('never treats STALE as terminal, since a stale job requeues rather than finishing', () => {
    expect(isTerminalJobState(JOB_STATE.STALE)).toBe(false);
  });

  it('treats an undefined state as not terminal, since a job with no data yet has not finished', () => {
    expect(isTerminalJobState(undefined)).toBe(false);
  });
});
