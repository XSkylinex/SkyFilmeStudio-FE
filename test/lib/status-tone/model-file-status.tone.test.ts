import { modelFileStatusSchema } from 'sky-filme-studio-be/contracts';
import type { ModelFileStatusValue } from 'sky-filme-studio-be/contracts';
import { MODEL_FILE_STATUS_TONE } from '@/lib/status-tone/model-file-status.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('MODEL_FILE_STATUS_TONE', () => {
  it('covers every status the contract defines, so a new one cannot render untoned', () => {
    expect(Object.keys(MODEL_FILE_STATUS_TONE).sort()).toEqual(
      [...modelFileStatusSchema.options].sort(),
    );
  });

  it('never gives a file that is not on disk, or does not match, a passing tone', () => {
    const failing: readonly ModelFileStatusValue[] = [
      'MISSING',
      'SIZE_MISMATCH',
      'HASH_MISMATCH',
      'UNREADABLE',
    ];

    failing.forEach((status) => {
      expect(MODEL_FILE_STATUS_TONE[status]).toBe(STATUS_TONE.DANGER);
    });
  });

  it('separates a file that is present but unverifiable from one that is verified', () => {
    expect(MODEL_FILE_STATUS_TONE.PRESENT_UNVERIFIABLE).not.toBe(
      MODEL_FILE_STATUS_TONE.VERIFIED,
    );
    expect(MODEL_FILE_STATUS_TONE.VERIFIED).toBe(STATUS_TONE.SUCCESS);
  });
});
