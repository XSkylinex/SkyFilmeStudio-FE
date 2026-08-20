import { SHOT_STATE } from 'sky-filme-studio-be/contracts';
import { SHOT_STATE_TONE } from '@/lib/status-tone/shot-state.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('SHOT_STATE_TONE', () => {
  it('covers every shot state the contract defines', () => {
    expect(Object.keys(SHOT_STATE_TONE).sort()).toEqual(
      Object.values(SHOT_STATE).sort(),
    );
  });

  it('marks the state that is waiting on a person as needing attention, not as progress', () => {
    expect(SHOT_STATE_TONE.MANUAL_REVIEW).toBe(STATUS_TONE.ATTENTION);
  });

  it('does not give a human rejection the same mark as a machine failure, since the next action differs', () => {
    expect(SHOT_STATE_TONE.REJECTED).not.toBe(SHOT_STATE_TONE.RENDER_FAILED);
    expect(SHOT_STATE_TONE.RENDER_FAILED).toBe(STATUS_TONE.DANGER);
  });

  it('reserves success for states a person actually approved', () => {
    expect(SHOT_STATE_TONE.VIDEO_READY).not.toBe(STATUS_TONE.SUCCESS);
    expect(SHOT_STATE_TONE.APPROVED).toBe(STATUS_TONE.SUCCESS);
    expect(SHOT_STATE_TONE.STORYBOARD_APPROVED).toBe(STATUS_TONE.SUCCESS);
  });
});
