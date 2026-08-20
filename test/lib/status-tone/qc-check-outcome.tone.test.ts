import { qcCheckOutcomeSchema } from 'sky-filme-studio-be/contracts';
import { APPROVAL_STATE_TONE } from '@/lib/status-tone/approval-state.tone';
import { QC_CHECK_OUTCOME_TONE } from '@/lib/status-tone/qc-check-outcome.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('QC_CHECK_OUTCOME_TONE', () => {
  it('covers every QC outcome the contract defines', () => {
    expect(Object.keys(QC_CHECK_OUTCOME_TONE).sort()).toEqual(
      [...qcCheckOutcomeSchema.options].sort(),
    );
  });

  it('never styles an automated pass as a human approval, because QC is advisory', () => {
    expect(QC_CHECK_OUTCOME_TONE.PASS).not.toBe(STATUS_TONE.SUCCESS);
    expect(QC_CHECK_OUTCOME_TONE.PASS).not.toBe(APPROVAL_STATE_TONE.APPROVED);
  });

  it('still shows a failed check as a failure', () => {
    expect(QC_CHECK_OUTCOME_TONE.FAIL).toBe(STATUS_TONE.DANGER);
  });
});
