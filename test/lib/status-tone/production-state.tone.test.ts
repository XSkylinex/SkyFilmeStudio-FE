import { PRODUCTION_STATE } from 'sky-filme-studio-be/contracts';
import { PRODUCTION_STATE_TONE } from '@/lib/status-tone/production-state.tone';
import { SHOT_STATE_TONE } from '@/lib/status-tone/shot-state.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('PRODUCTION_STATE_TONE', () => {
  it('covers every production state the contract defines', () => {
    expect(Object.keys(PRODUCTION_STATE_TONE).sort()).toEqual(
      Object.values(PRODUCTION_STATE).sort(),
    );
  });

  it('gives every state a person signed off the same tone, here and in the shot map', () => {
    const successStates = Object.entries(PRODUCTION_STATE_TONE)
      .filter(([, tone]) => tone === STATUS_TONE.SUCCESS)
      .map(([state]) => state)
      .sort();

    expect(successStates).toEqual(
      [
        PRODUCTION_STATE.OUTLINE_APPROVED,
        PRODUCTION_STATE.SCREENPLAY_APPROVED,
        PRODUCTION_STATE.COMPLETE,
      ].sort(),
    );
    expect(PRODUCTION_STATE_TONE.SCREENPLAY_APPROVED).toBe(
      SHOT_STATE_TONE.STORYBOARD_APPROVED,
    );
  });

  it('does not let a signed-off screenplay look like output nobody has reviewed', () => {
    expect(PRODUCTION_STATE_TONE.SCREENPLAY_APPROVED).not.toBe(
      SHOT_STATE_TONE.VIDEO_READY,
    );
  });

  it('flags both review gates as waiting on a person', () => {
    expect(PRODUCTION_STATE_TONE.STORYBOARD_REVIEW).toBe(STATUS_TONE.ATTENTION);
    expect(PRODUCTION_STATE_TONE.SHOT_REVIEW).toBe(STATUS_TONE.ATTENTION);
  });
});
