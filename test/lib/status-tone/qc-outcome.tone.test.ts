import { qcOutcomeSchema } from 'sky-filme-studio-be/contracts';
import { QC_OUTCOME_TONE } from '@/lib/status-tone/qc-outcome.tone';
import { QC_CHECK_OUTCOME_TONE } from '@/lib/status-tone/qc-check-outcome.tone';
import { SHOT_STATE_TONE } from '@/lib/status-tone/shot-state.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('QC_OUTCOME_TONE', () => {
  it('covers every verdict the contract defines', () => {
    expect(Object.keys(QC_OUTCOME_TONE).sort()).toEqual(
      [...qcOutcomeSchema.options].sort(),
    );
  });

  it('never gives an automated verdict the tone a human approval wears', () => {
    const automated = [
      ...Object.values(QC_OUTCOME_TONE),
      ...Object.values(QC_CHECK_OUTCOME_TONE),
    ];

    expect(automated).not.toContain(STATUS_TONE.SUCCESS);
    expect(SHOT_STATE_TONE.APPROVED).toBe(STATUS_TONE.SUCCESS);
  });

  it('reads a skipped check as unknown rather than as passed', () => {
    expect(QC_OUTCOME_TONE.SKIPPED).toBe(STATUS_TONE.NEUTRAL);
    expect(QC_OUTCOME_TONE.SKIPPED).not.toBe(QC_OUTCOME_TONE.PASS);
  });
});
