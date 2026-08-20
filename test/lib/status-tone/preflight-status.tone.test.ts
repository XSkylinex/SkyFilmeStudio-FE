import { PREFLIGHT_STATUS } from 'sky-filme-studio-be/contracts';
import { PREFLIGHT_STATUS_TONE } from '@/lib/status-tone/preflight-status.tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';

describe('PREFLIGHT_STATUS_TONE', () => {
  it('covers every preflight status the contract defines', () => {
    expect(Object.keys(PREFLIGHT_STATUS_TONE).sort()).toEqual(
      Object.values(PREFLIGHT_STATUS).sort(),
    );
  });

  it('does not let an unwritten check read as a passing one', () => {
    expect(PREFLIGHT_STATUS_TONE.NOT_IMPLEMENTED).not.toBe(STATUS_TONE.SUCCESS);
    expect(PREFLIGHT_STATUS_TONE.NOT_IMPLEMENTED).toBe(STATUS_TONE.STALE);
  });
});
